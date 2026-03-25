package com.rbac.controller;

import com.rbac.dto.request.LoginRequest;
import com.rbac.dto.request.RegisterRequest;
import com.rbac.dto.response.ApiResponse;
import com.rbac.dto.response.AuthResponse;
import com.rbac.dto.response.UserResponse;
import com.rbac.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Handles authentication endpoints: register, login, and current user profile.
 * All /api/auth/** paths are publicly accessible (no JWT required).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and user profile endpoints")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user and receive a JWT token.
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates an account and returns a JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse authResponse = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", authResponse));
    }

    /**
     * POST /api/auth/login
     * Authenticate with email + password and receive a JWT token.
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate and receive a JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    /**
     * GET /api/auth/me
     * Returns the profile of the currently authenticated user.
     * Requires a valid JWT token.
     */
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns profile of the authenticated user")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        UserResponse user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", user));
    }
}
