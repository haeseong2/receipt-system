package com.haeseong.receipt_app.dto.receipt;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReceiptModifyRequest {
    private LocalDate transactionDate;
    private String storeName;
    private Integer totalAmount;
    private Integer itemCount;
    private String category;
    private String currency;
}