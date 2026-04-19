package com.haeseong.receipt_app.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haeseong.receipt_app.service.OcrService;
import com.haeseong.receipt_app.service.LlmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final OcrService ocrService;
    private final LlmService llmService;

    public FileUploadController(OcrService ocrService, LlmService llmService) {
        this.ocrService = ocrService;
        this.llmService = llmService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {

        try {
            String uploadDir = "C:/project/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String filePath = uploadDir + file.getOriginalFilename();
            File savedFile = new File(filePath);
            file.transferTo(savedFile);

            System.out.println("파일 도착: " + file.getOriginalFilename());

            // OCR 호출
            String ocrResult = ocrService.sendToOcr(savedFile);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(ocrResult);

            boolean success = root.has("success") && root.get("success").asBoolean();
            String text = root.has("text") ? root.get("text").asText() : "";

            if (!success || text == null || text.trim().isEmpty()) {
                return ResponseEntity.ok("영수증이 도착하지 않았습니다");
            } else {
                String llmResult = llmService.parseReceipt(text);
                System.out.println("LLM 결과: " + llmResult);
                return ResponseEntity.ok(llmResult);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("FAIL");
        }
    }
}