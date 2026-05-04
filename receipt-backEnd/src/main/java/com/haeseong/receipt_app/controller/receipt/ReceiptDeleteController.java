package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.service.receipt.ReceiptDeleteService;
import com.haeseong.receipt_app.service.utile.SessionUserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReceiptDeleteController {

    private final ReceiptDeleteService receiptDeleteService;
    private final SessionUserService sessionUserService;

    @DeleteMapping("/receipts/{receiptId}")
    public ResponseEntity<String> deleteReceipt(@PathVariable Long receiptId, HttpSession session) {
        System.out.println("deleteReceipt() receiptId = " + receiptId);

        Long userId    = sessionUserService.getLoginUser(session).getUserId();
        System.out.println("userId = " + userId);

        receiptDeleteService.deleteReceipt(receiptId, userId);
        return ResponseEntity.noContent().build();
    }
}