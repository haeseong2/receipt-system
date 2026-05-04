package com.haeseong.receipt_app.dto.receiptMain;

import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ReceiptRecentResponse {

    private String storeName;
    private LocalDate transactionDate;
    private Long amount;
    private String currency;
    private String category;
}