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
            // 운영
            String url = "http://ollama:11434/api/generate";

            // 개발
            //String url = "http://localhost:11434/api/generate";
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
반드시 완전한 JSON 하나만 출력하고 끝내라.
중간에 끊지 마라.
[입력 데이터]
""" + ocrText;
            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama3");
            body.put("prompt", prompt);
            body.put("stream", false);
            body.put("format", "json");
            body.put("options", Map.of("temperature", 0));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            String raw = root.get("response") != null
                    ? root.get("response").asText("")
                    : root.toString();

            if (raw == null || raw.isBlank()) {
                throw new RuntimeException("LLM 응답 없음");
            }

            raw = raw.replace("```json", "")
                    .replace("```", "")
                    .trim();

            int start = raw.indexOf("{");
            int end = raw.lastIndexOf("}");

            if (start == -1 || end == -1 || end <= start) {
                System.out.println("RAW 문제 데이터: " + raw);
                throw new RuntimeException("JSON 없음");
            }

            String result = raw.substring(start, end + 1);

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