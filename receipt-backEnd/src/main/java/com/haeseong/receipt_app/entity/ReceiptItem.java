package com.haeseong.receipt_app.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    private String name;
    private Integer price;
    private Integer quantity;
    private String category;
}