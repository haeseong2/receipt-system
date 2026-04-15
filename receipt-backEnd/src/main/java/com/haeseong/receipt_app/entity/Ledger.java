package com.haeseong.receipt_app.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ledgerId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate date;
    private String category;
    private Integer amount;

    @ManyToOne
    @JoinColumn(name = "receipt_id", nullable = true)
    private Receipt receipt;
}