package com.haeseong.receipt_app.dto.receipt;

import lombok.*;

@Getter
@AllArgsConstructor
public class ReceiptSaveResponse {

    private String result;
    private Long receiptId;
}