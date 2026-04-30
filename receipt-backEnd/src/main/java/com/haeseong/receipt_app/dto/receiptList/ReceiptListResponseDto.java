package com.haeseong.receipt_app.dto.receiptList;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptListResponseDto {

    private Long receiptId;
    private String storeName;
    private String transactionDate;
    private Long totalAmount;
    private String category;
    private String imageUrl;
}