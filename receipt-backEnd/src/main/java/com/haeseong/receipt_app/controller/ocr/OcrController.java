package com.haeseong.receipt_app.controller.ocr;

import com.haeseong.receipt_app.service.ocr.OcrPipelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OcrController {

    private final OcrPipelineService pipelineService;

    public OcrController(OcrPipelineService pipelineService) {
        this.pipelineService = pipelineService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {

        try {
            // =====================================================
            // 날짜/시간 생성
            // =====================================================
            LocalDateTime now = LocalDateTime.now();
            String date = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String time = now.format(DateTimeFormatter.ofPattern("HH-mm-ss"));

            // =====================================================
            // 저장 경로 생성
            // =====================================================
            String baseDir = "C:/project/storage/" + date + "/";
            File dir = new File(baseDir);
            if (!dir.exists()) dir.mkdirs();

            // =====================================================
            // 원본 파일 저장
            // =====================================================
            String imagePath = baseDir + time + "_image.jpg";
            File savedFile = new File(imagePath);
            file.transferTo(savedFile);

            // =====================================================
            // 파이프라인 실행 (JSON 반환)
            // =====================================================
            String resultJson = pipelineService.process(savedFile);

            // =====================================================
            // JSON 파일 저장
            // =====================================================
            String jsonPath = baseDir + time + "_result.json";
            java.nio.file.Files.write(
                    java.nio.file.Paths.get(jsonPath),
                    resultJson.getBytes()
            );

            // =====================================================
            // 프론트에 JSON 반환
            // =====================================================
            return ResponseEntity.ok(resultJson);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("FAIL");
        }
    }
}