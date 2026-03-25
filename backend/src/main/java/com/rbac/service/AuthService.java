package com.rbac.service;

import com.rbac.dto.request.LoginRequest;
import com.rbac.dto.request.RegisterRequest;
import com.rbac.dto.response.AuthResponse;
import com.rbac.dto.response.UserResponse;

import java.util.List;

/**
 * Contract for authentication and user management operations.
 * The implementation lives in AuthServiceImpl.
 */
public interface AuthService {

    /**
     * Register a new user and return auth credentials.
     *
     * @param request registration payload
     * @return JWT token + user info
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate an existing user and return a JWT token.
     *
     * @param request login payload
     * @return JWT token + user info
     */
    AuthResponse login(LoginRequest request);

    /**
     * Retrieve the profile of the currently authenticated user.
     *
     * @param email authenticated user's email (from SecurityContext)
     * @return user profile DTO
     */
    UserResponse getCurrentUser(String email);

    /**
     * Retrieve all registered users (ADMIN only).
     *
     * @return list of all user profiles
     */
    List<UserResponse> getAllUsers();
}
