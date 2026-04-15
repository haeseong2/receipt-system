package com.haeseong.receipt_app.controller;

import com.haeseong.receipt_app.service.OcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final OcrService ocrService;

    public FileUploadController(OcrService ocrService) {
        this.ocrService = ocrService;
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

            // 🔥 OCR 호출
            String ocrResult = ocrService.sendToOcr(savedFile);
            System.out.println("OCR 결과: " + ocrResult);

            return ResponseEntity.ok(ocrResult);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("FAIL");
        }
    }
}