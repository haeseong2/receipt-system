package com.haeseong.receipt_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.haeseong.receipt_app.entity.Ledger;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findAllByUserUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}