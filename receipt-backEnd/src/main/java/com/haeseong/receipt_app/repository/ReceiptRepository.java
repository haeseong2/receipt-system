package com.haeseong.receipt_app.repository;

import com.haeseong.receipt_app.domain.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ReceiptRepository
        extends JpaRepository<Receipt,Long>{

    Page<Receipt>
    findByUserUserIdAndTransactionDateBetweenAndCategoryContainingAndStoreNameContaining(
            Long userId,
            LocalDate startDate,
            LocalDate endDate,
            String category,
            String storeName,
            Pageable pageable
    );

}