package com.rbac;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the RBAC Authentication System.
 * Bootstraps the Spring Boot application context.
 */
@SpringBootApplication
public class RbacAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(RbacAuthApplication.class, args);
    }
}
