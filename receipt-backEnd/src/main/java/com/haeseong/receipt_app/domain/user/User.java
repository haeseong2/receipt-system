package com.haeseong.receipt_app.domain.user;

import jakarta.persistence.*;
import lombok.*;

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
    private Long userId;

    @Column(name="login_id")
    private String loginId;

    @Column(name="password_hash")
    private String passwordHash;

    @Column(name="user_name")
    private String userName;
}