package com.rbac.repository;

import com.rbac.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA Repository for User entity.
 * Spring Data generates all SQL automatically.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address (used for login).
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered (used during registration).
     */
    boolean existsByEmail(String email);
}
