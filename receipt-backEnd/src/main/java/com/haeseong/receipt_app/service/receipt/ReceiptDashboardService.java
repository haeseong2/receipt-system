package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.dto.receiptMain.ReceiptCategoryResponse;
import com.haeseong.receipt_app.dto.receiptMain.ReceiptDashboardResponse;
import com.haeseong.receipt_app.dto.receiptMain.ReceiptRecentResponse;
import com.haeseong.receipt_app.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptDashboardService {

    private final ReceiptRepository receiptRepository;

    public ReceiptDashboardResponse getDashboard(Long userId) {
        LocalDate now = LocalDate.now();

        // 이번달
        LocalDate thisStart = now.withDayOfMonth(1);
        LocalDate thisEnd = now.withDayOfMonth(now.lengthOfMonth());

        // 지난달
        LocalDate lastStart = thisStart.minusMonths(1);
        LocalDate lastEnd = lastStart.withDayOfMonth(lastStart.lengthOfMonth());

        // 합계
        BigDecimal thisMonth = receiptRepository.sumAmount(userId, thisStart, thisEnd);
        BigDecimal lastMonth = receiptRepository.sumAmount(userId, lastStart, lastEnd);

        // 증감률
        double percent = 0;
        if (lastMonth.compareTo(BigDecimal.ZERO) != 0) {
            percent = thisMonth.subtract(lastMonth)
                    .divide(lastMonth, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        // 카테고리
        List<ReceiptCategoryResponse> categories =  receiptRepository.getCategorySum(userId,thisStart,thisEnd,lastStart,lastEnd);

        // 최근 영수증 5개
        List<ReceiptRecentResponse> recent = receiptRepository.findRecent(userId, PageRequest.of(0, 5));

        return ReceiptDashboardResponse.builder()
                .thisMonth(thisMonth)
                .lastMonth(lastMonth)
                .percent(percent)
                .categories(categories)
                .recent(recent)
                .build();
    }
}