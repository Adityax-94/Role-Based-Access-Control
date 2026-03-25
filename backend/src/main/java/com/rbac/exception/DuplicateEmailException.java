package com.rbac.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Alias kept for backward compat - maps to EmailAlreadyExistsException behavior.
 * Thrown when a registration attempt uses an already-registered email.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
