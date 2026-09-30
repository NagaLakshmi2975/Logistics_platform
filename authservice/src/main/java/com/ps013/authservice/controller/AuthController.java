package com.ps013.authservice.controller;

import com.ps013.authservice.dto.UserResponse;
import com.ps013.authservice.entity.User;
import com.ps013.authservice.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password) {

        User user = authService.register(
                username,
                email,
                password
        );

        UserResponse response = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String username,
            @RequestParam String password) {

        String token = authService.login(
                username,
                password
        );

        return ResponseEntity.ok(token);
    }

    @GetMapping("/profile")
    public ResponseEntity<String> profile(
            Authentication authentication) {

        return ResponseEntity.ok(
                "Logged in as: " + authentication.getName()
        );
    }
}