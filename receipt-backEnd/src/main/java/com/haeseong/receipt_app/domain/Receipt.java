package com.haeseong.receipt_app.domain;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="receipt")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="receipt_id")
    private Long receiptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @Column(name="store_name")
    private String storeName;

    @Column(name="transaction_date")
    private LocalDate transactionDate;

    @Column(name="total_amount")
    private Long totalAmount;

    @Column(name="item_count")
    private Integer itemCount;

    @Column(name="category")
    private String category;

    @Column(name="currency")
    private String currency;

    @Column(name="ocr_confidence")
    private Double ocrConfidence;

    @Column(name="receipt_image_path")
    private String receiptImagePath;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}