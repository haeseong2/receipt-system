package com.haeseong.receipt_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.haeseong.receipt_app.entity.ReceiptItem;

@Repository
public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, Long> {}