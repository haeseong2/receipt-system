package com.haeseong.receipt_app.repository;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.dto.receiptMain.ReceiptCategoryResponse;
import com.haeseong.receipt_app.dto.receiptMain.ReceiptRecentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    Page<Receipt>
    findByUserUserIdAndTransactionDateBetweenAndCategoryContainingAndStoreNameContaining(
            Long userId,
            LocalDate startDate,
            LocalDate endDate,
            String category,
            String storeName,
            Pageable pageable
    );

    Optional<Receipt> findByReceiptIdAndUserUserId(Long receiptId, Long userId);

    // 이번달 / 지난달 합계
    @Query("""
        SELECT COALESCE(SUM(r.totalAmount), 0)
        FROM Receipt r
        WHERE r.user.userId = :userId
        AND r.transactionDate BETWEEN :start AND :end
    """)
    BigDecimal sumAmount(Long userId, LocalDate start, LocalDate end);

    // 카테고리별 합계
    @Query("""
    SELECT new com.haeseong.receipt_app.dto.receiptMain.ReceiptCategoryResponse(
        r.category,
        SUM(CASE WHEN r.transactionDate BETWEEN :thisStart AND :thisEnd THEN r.totalAmount ELSE 0 END),
        SUM(CASE WHEN r.transactionDate BETWEEN :lastStart AND :lastEnd THEN r.totalAmount ELSE 0 END)
    )
    FROM Receipt r
    WHERE r.user.userId = :userId
    AND r.transactionDate BETWEEN :lastStart AND :thisEnd
    GROUP BY r.category
""")
    List<ReceiptCategoryResponse> getCategorySum(Long userId,LocalDate thisStart, LocalDate thisEnd, LocalDate lastStart, LocalDate lastEnd);

    @Query("""
    SELECT new com.haeseong.receipt_app.dto.receiptMain.ReceiptRecentResponse(
        r.storeName,
        r.transactionDate,
        r.totalAmount,
        r.currency,
        r.category
    )
    FROM Receipt r
    WHERE r.user.userId = :userId
    ORDER BY r.transactionDate DESC
""")
    List<ReceiptRecentResponse> findRecent(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT r FROM Receipt r WHERE r.user.userId = :userId AND YEAR(r.transactionDate) = :year")
    List<Receipt> findByUser_UserIdAndTransactionDateYear(Long userId, int year);
}