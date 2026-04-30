package com.haeseong.receipt_app.service.receipt;

import com.haeseong.receipt_app.domain.Receipt;
import com.haeseong.receipt_app.domain.User;

import com.haeseong.receipt_app.dto.receipt.ReceiptSaveRequest;

import com.haeseong.receipt_app.repository.ReceiptRepository;
import com.haeseong.receipt_app.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;

    public ReceiptService(ReceiptRepository receiptRepository,UserRepository userRepository){
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Long saveReceipt(Long userId,ReceiptSaveRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("사용자 없음"));

        String imagePath = null;
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            LocalDateTime now = LocalDateTime.now();
            String dateDir = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            String timeStamp = now.format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = timeStamp + "_" + request.getFile().getOriginalFilename();

            String uploadDir = "C:/receipt/receipt-backEnd/storage/result/" + dateDir + "/";

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File saveFile = new File(uploadDir + fileName);
            request.getFile().transferTo(saveFile);

            imagePath = "/images/" + dateDir + "/" + fileName;
        }

        Receipt receipt =
                Receipt.builder()
                        .user(user)
                        .storeName(request.getStoreName())
                        .transactionDate(LocalDate.parse(request.getTransactionDate()))
                        .totalAmount(request.getTotalAmount())
                        .itemCount(request.getItemCount())
                        .category(request.getCategory())
                        .currency(request.getCurrency())
                        .ocrConfidence(request.getOcrConfidence())
                        .receiptImagePath(imagePath)
                        .createdAt(LocalDateTime.now())
                        .build();
        receiptRepository.save(receipt);
        return receipt.getReceiptId();
    }
}