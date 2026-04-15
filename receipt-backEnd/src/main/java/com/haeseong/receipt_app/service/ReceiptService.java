package com.haeseong.receipt_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.haeseong.receipt_app.entity.*;
import com.haeseong.receipt_app.repository.*;

import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepo;

    @Autowired
    private ReceiptItemRepository itemRepo;

    public Receipt saveReceipt(Receipt receipt) {
        return receiptRepo.save(receipt);
    }

    public List<Receipt> getUserReceipts(Long userId) {
        return receiptRepo.findAllByUserUserId(userId);
    }

    public Optional<Receipt> getReceipt(Long receiptId) {
        return receiptRepo.findById(receiptId);
    }

    public void deleteReceipt(Long receiptId) {
        receiptRepo.deleteById(receiptId);
    }
}