package com.haeseong.receipt_app.client;

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

            // 강화된 프롬프트
            String prompt = """
너는 영수증 데이터를 JSON으로 변환하는 시스템이다.

반드시 JSON만 출력해라.
설명, 문장, 코드블럭, ``` 절대 출력하지 마라.

[출력 형식]
{
  "storeName": "string",
  "transactionDate": "YYYY-MM-DD",
  "totalAmount": number,
  "currency": "KRW | JPY | USD",
  "paymentMethod": "CARD | CASH | QR | OTHER",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "ocrConfidence": number
}

[규칙]
1. transactionDate는 반드시 YYYY-MM-DD 형식
2. currency는 KRW, JPY, USD 중 하나만
3. paymentMethod는 CARD, CASH, QR, OTHER 중 하나만
4. totalAmount, quantity, price, ocrConfidence는 숫자
5. items는 배열 유지
6. 날짜, 시간 등 의미 없는 항목은 items에서 제거
7. 잘못 인식된 텍스트는 가능한 정상 값으로 보정
8. 값이 없으면 null
9. JSON 외 텍스트 출력 금지

[입력 데이터]
""" + ocrText;

            // 요청 바디
            Map<String, Object> body = new HashMap<>();
            body.put("model", "mistral");
            body.put("prompt", prompt);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            // 응답 파싱
            JsonNode root = mapper.readTree(response.getBody());
            String result = root.get("response").asText();

            // 코드블럭 제거
            result = result
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            // JSON 영역만 추출
            int start = result.indexOf("{");
            int end = result.lastIndexOf("}");

            if (start != -1 && end != -1 && start < end) {
                result = result.substring(start, end + 1);
            } else {
                throw new RuntimeException("JSON 파싱 실패");
            }

            // JSON 유효성 검증 (한 번 더 체크)
            mapper.readTree(result);

            return result;

        } catch (Exception e) {
            e.printStackTrace();

            // 완전 실패 대비 fallback
            return """
{
  "storeName": null,
  "transactionDate": null,
  "totalAmount": 0,
  "currency": "JPY",
  "paymentMethod": "OTHER",
  "items": [],
  "ocrConfidence": 0.0
}
""";
        }
    }
}