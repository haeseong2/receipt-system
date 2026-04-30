package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.dto.receipt.ReceiptSaveRequest;
import com.haeseong.receipt_app.service.receipt.ReceiptService;
import com.haeseong.receipt_app.service.utile.SessionUserService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ReceiptsController {
    private final ReceiptService receiptService;
    private final SessionUserService sessionUserService;

    public ReceiptsController(ReceiptService receiptService, SessionUserService sessionUserService){
        this.receiptService = receiptService;
        this.sessionUserService = sessionUserService;
    }

    @PostMapping(value="/receipts",consumes="multipart/form-data")
    public ResponseEntity<Long> saveReceipt(@ModelAttribute ReceiptSaveRequest request, HttpSession session) throws IOException {

        Long userId    = sessionUserService.getLoginUser(session).getUserId();
        Long receiptId = receiptService.saveReceipt(userId,request);

        return ResponseEntity.ok(receiptId);
    }
}