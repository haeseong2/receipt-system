package com.haeseong.receipt_app.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receiptId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String storeName;
    private LocalDate purchaseDate;
    private Integer totalPrice;
    private String imageUrl;
    private LocalDateTime uploadDate = LocalDateTime.now();

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    private List<ReceiptItem> items;
}