package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.dto.receiptList.ReceiptListResponseDto;
import com.haeseong.receipt_app.repository.ReceiptRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReceiptListService {
    private final ReceiptRepository receiptRepository;

    public Page<ReceiptListResponseDto> getReceiptList(Long userId, int page, int size, Integer year, Integer month, String category, String storeName){
        Pageable pageable = PageRequest.of(page, size,
                    Sort.by(
                            Sort.Order.asc("transactionDate"),
                            Sort.Order.asc("createdAt")
                           ));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Page<Receipt> receipts = receiptRepository.findByUserUserIdAndTransactionDateBetweenAndCategoryContainingAndStoreNameContaining(
                userId,
                startDate,
                endDate,
                category == null ? "" : category,
                storeName == null ? "" : storeName,
                pageable
        );

        return receipts.map(receipt ->
                        ReceiptListResponseDto.builder()
                                .receiptId(receipt.getReceiptId())
                                .storeName(receipt.getStoreName())
                                .transactionDate(receipt.getTransactionDate().toString())
                                .itemCount(receipt.getItemCount().toString())
                                .totalAmount(receipt.getTotalAmount())
                                .currency(receipt.getCurrency())
                                .category(receipt.getCategory())
                                .imageUrl(receipt.getReceiptImagePath())
                                .build()
        );
    }

}