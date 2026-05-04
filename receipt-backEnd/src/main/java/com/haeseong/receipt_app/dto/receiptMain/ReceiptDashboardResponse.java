package com.haeseong.receipt_app.dto.receiptMain;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptDashboardResponse {

    private BigDecimal thisMonth;
    private BigDecimal lastMonth;
    private double percent;

    private List<ReceiptCategoryResponse> categories;
    private List<ReceiptRecentResponse> recent;
}