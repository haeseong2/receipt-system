package com.haeseong.receipt_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.haeseong.receipt_app.domain.user.User;

public interface UserRepository
        extends JpaRepository<User,Long>{

    Optional<User> findByLoginId(String loginId);

}