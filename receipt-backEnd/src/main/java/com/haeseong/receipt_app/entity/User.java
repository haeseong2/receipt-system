package com.haeseong.receipt_app.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String email;
    private String passwordHash;
    private String name;
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Receipt> receipts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Ledger> ledgers;
}