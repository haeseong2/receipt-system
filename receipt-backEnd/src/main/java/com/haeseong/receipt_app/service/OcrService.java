package com.haeseong.receipt_app.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;

import java.io.File;
import java.nio.file.Files;

@Service
public class OcrService {

    public String sendToOcr(File file) {
        try {
            System.out.println("sendToOcr() 호출");
            String url = "http://localhost:8000/ocr";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            byte[] fileBytes = Files.readAllBytes(file.toPath());

            MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
            body.add("file", new org.springframework.core.io.ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return file.getName();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, requestEntity, String.class);

            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return "OCR 호출 실패";
        }
    }
}