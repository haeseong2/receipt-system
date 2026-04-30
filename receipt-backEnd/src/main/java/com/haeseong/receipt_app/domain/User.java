package com.haeseong.receipt_app.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long userId;

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
    private List<Receipt> receipts;

    @Column(name="login_id")
    private String loginId;

    @Column(name="password_hash")
    private String passwordHash;

    @Column(name="user_name")
    private String userName;
}