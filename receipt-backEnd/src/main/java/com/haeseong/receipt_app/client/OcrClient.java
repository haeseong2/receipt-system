package com.haeseong.receipt_app.client;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.*;

import java.io.File;
import java.nio.file.Files;

@Component
public class OcrClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public String requestOcr(File file) {
        try {
            String url = "http://127.0.0.1:8000/ocr";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            byte[] fileBytes = Files.readAllBytes(file.toPath());

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return file.getName();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("OCR 요청 실패", e);
        }
    }
}