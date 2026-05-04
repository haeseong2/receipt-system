package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.dto.receipt.ReceiptModifyRequest;
import com.haeseong.receipt_app.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReceiptModifyService {

    private final ReceiptRepository receiptRepository;

    @Transactional
    public void modifyReceipt(Long receiptId, ReceiptModifyRequest dto, Long userId) {
        Receipt receipt = receiptRepository.findByReceiptIdAndUserUserId(receiptId, userId)
                .orElseThrow(() -> new IllegalArgumentException("영수증 없음"));

        // 수정 필드들
        receipt.setTransactionDate(dto.getTransactionDate());
        receipt.setStoreName(dto.getStoreName());
        receipt.setTotalAmount(Long.valueOf(dto.getTotalAmount()));
        receipt.setItemCount(dto.getItemCount());
        receipt.setCategory(dto.getCategory());
        receipt.setCurrency(dto.getCurrency());
    }
}