package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReceiptDeleteService {

    private final ReceiptRepository receiptRepository;

    public void deleteReceipt(Long receiptId, Long userId) {
        System.out.println("userId = " + userId);

        Receipt receipt = receiptRepository.findByReceiptIdAndUserUserId(receiptId, userId)
                .orElseThrow(() -> new RuntimeException("삭제할 데이터 없음"));

        receiptRepository.delete(receipt);
    }
}