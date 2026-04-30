package com.haeseong.receipt_app.client;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class LlmClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String requestLlm(String ocrText) {
        try {
            String url = "http://localhost:11434/api/generate";
            String prompt = """
너는 영수증 데이터를 JSON으로 변환하는 시스템이다.

반드시 JSON만 출력해라.
설명, 문장, 코드블럭, ``` 절대 출력하지 마라.
주석(//, /* */) 절대 금지.

[출력 형식]
{
  "storeName": "string",
  "transactionDate": "YYYY-MM-DD",
  "totalAmount": number,
  "itemCount": number,
  "currency": "KRW | JPY | USD",
  "ocrConfidence": number
}

[규칙]
1. transactionDate는 YYYY-MM-DD
2. currency는 KRW, JPY, USD 중 하나
3. number 필드는 숫자 (따옴표 금지)
4. itemCount = 상품 개수
5. 의미 없는 데이터 제거
6. 값 없으면 null
7. JSON 외 출력 금지

[입력 데이터]
""" + ocrText;
            Map<String, Object> body = new HashMap<>();
            body.put("model", "mistral");
            body.put("prompt", prompt);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            String raw = root.get("response").asText();

            // 디버깅 로그
            System.out.println("===== LLM RAW =====");
            System.out.println(raw);
            System.out.println("===================");

            // 정제 시작
            String result = raw
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .replaceAll("//.*", "")              // 한줄 주석 제거
                    .replaceAll("/\\*.*?\\*/", "")       // 블록 주석 제거
                    .trim();

            // JSON 부분만 추출
            int start = result.indexOf("{");
            int end = result.lastIndexOf("}");

            if (start == -1 || end == -1) {
                throw new RuntimeException("JSON 없음");
            }

            result = result.substring(start, end + 1);

            // JSON 검증
            mapper.readTree(result);

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return """
{
  "storeName": null,
  "transactionDate": null,
  "totalAmount": 0,
  "itemCount": 0,
  "currency": "JPY",
  "ocrConfidence": 0.0
}
""";
        }
    }
}