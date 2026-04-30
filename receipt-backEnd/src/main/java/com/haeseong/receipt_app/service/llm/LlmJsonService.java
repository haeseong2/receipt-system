package com.haeseong.receipt_app.service.llm;

import com.haeseong.receipt_app.client.LlmClient;
import org.springframework.stereotype.Service;

@Service
public class LlmJsonService {

    private final LlmClient llmClient;

    public LlmJsonService(LlmClient llmClient) {
        this.llmClient = llmClient;
    }
    public String generateJson(String ocrText) {
        return llmClient.requestLlm(ocrText);
    }
}