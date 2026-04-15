package com.haeseong.receipt_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.haeseong.receipt_app.entity.*;
import com.haeseong.receipt_app.service.ReceiptService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReceipt(@RequestParam Long userId, @RequestParam MultipartFile file) {
        // TODO: 이미지 저장 + OCR 처리
        Receipt receipt = Receipt.builder()
                .user(User.builder().userId(userId).build())
                .storeName("테스트 가게")
                .totalPrice(10000)
                .build();
        receiptService.saveReceipt(receipt);

        return ResponseEntity.ok(Map.of("receiptId", receipt.getReceiptId(), "status", "success"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceipt(@PathVariable Long id) {
        return receiptService.getReceipt(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Receipt> getUserReceipts(@PathVariable Long userId) {
        return receiptService.getUserReceipts(userId);
    }
}