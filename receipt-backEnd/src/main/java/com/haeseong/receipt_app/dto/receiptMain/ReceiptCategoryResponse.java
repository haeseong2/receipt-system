package com.haeseong.receipt_app.dto.receiptMain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReceiptCategoryResponse {

    private String category;
    private Long amount;
    private Long lastAmount;
}