package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.dto.receipt.ReceiptModifyRequest;
import com.haeseong.receipt_app.service.receipt.ReceiptModifyService;
import com.haeseong.receipt_app.service.utile.SessionUserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReceiptModifyController {

    private final ReceiptModifyService receiptModifyService;
    private final SessionUserService sessionUserService;

    @PutMapping("/receipts/{receiptId}")
    public ResponseEntity<Void> modifyReceipt(@PathVariable Long receiptId, @RequestBody ReceiptModifyRequest requestDto, HttpSession session){
        Long userId = sessionUserService.getLoginUser(session).getUserId();

        receiptModifyService.modifyReceipt(receiptId, requestDto, userId);
        return ResponseEntity.ok().build();
    }
}