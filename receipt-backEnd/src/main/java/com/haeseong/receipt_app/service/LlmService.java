package com.haeseong.receipt_app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class LlmService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String parseReceipt(String ocrText) {
        try {
            System.out.println("parseReceipt() 호출");
            String url = "http://localhost:11434/api/generate";

            String prompt = """
다음은 OCR 텍스트다.
반드시 JSON만 출력해라.
설명 절대 하지마라.
문장, 영어, 부연 설명 금지.

형식:
{
  "date": "",
  "total": 0,
  "items": [
    {"name": "", "price": 0}
  ]
}

텍스트:
""" + ocrText;

            Map<String, Object> body = new HashMap<>();
            body.put("model", "mistral");
            body.put("prompt", prompt);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            String result = root.get("response").asText();

            // JSON 깨짐 방지
            result = result.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }
}