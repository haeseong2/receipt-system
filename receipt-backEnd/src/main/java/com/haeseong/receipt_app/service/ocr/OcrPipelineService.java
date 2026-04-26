package com.haeseong.receipt_app.service.ocr;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haeseong.receipt_app.client.OcrClient;
import com.haeseong.receipt_app.service.llm.LlmJsonService;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OcrPipelineService {

    private final OcrClient ocrClient;
    private final LlmJsonService llmService;
    private final ObjectMapper mapper = new ObjectMapper();

    public OcrPipelineService(OcrClient ocrClient, LlmJsonService llmService) {
        this.ocrClient = ocrClient;
        this.llmService = llmService;
    }
    /**
     * OCR → LLM 전체 파이프라인 처리
     * @param file 업로드된 이미지 파일
     * @return LLM이 생성한 JSON 문자열
     */
    public String process(File file) {
        try {
            // =====================================================
            // OCR 서버 호출
            // =====================================================
            String ocrResult = ocrClient.requestOcr(file);

            // 디버깅 로그 (문제 생기면 여기 보면 됨)
            System.out.println("OCR RAW: " + ocrResult);

            // =====================================================
            // OCR 응답 JSON 파싱
            // =====================================================
            JsonNode root = mapper.readTree(ocrResult);

            boolean success = root.has("success") && root.get("success").asBoolean();
            String text = "";

            if (root.has("ocrText")) {
                text = root.get("ocrText").asText();
            } else if (root.has("text")) {
                text = root.get("text").asText();
            }

            // =====================================================
            // OCR 결과 검증
            // =====================================================
            if (!success || text.isBlank()) {
                throw new RuntimeException("OCR 결과 없음");
            }
            // =====================================================
            // LLM 호출 (JSON 생성)
            // =====================================================
            String llmResult = llmService.generateJson(text);
            System.out.println("LLM RESULT: " + llmResult);

            return llmResult;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Pipeline 실패", e);
        }
    }
}