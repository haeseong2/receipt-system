package com.haeseong.receipt_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.haeseong.receipt_app.entity.Receipt;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findAllByUserUserId(Long userId);
}