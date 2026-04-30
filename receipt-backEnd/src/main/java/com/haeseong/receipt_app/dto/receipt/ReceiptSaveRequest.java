package com.haeseong.receipt_app.dto.receipt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ReceiptSaveRequest {
    private String storeName;
    private String transactionDate;
    private Long totalAmount;
    private Integer itemCount;
    private String category;
    private String currency;
    private Double ocrConfidence;
    private MultipartFile file;
}