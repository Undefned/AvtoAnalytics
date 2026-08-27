package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.security.JwtTokenProvider;
import com.avtoanalytics.avtoanalytics.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and favorites endpoints")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(userService.getCurrentUser(userId));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<User> updateUser(
            @RequestBody User user,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(userService.updateUser(userId, user));
    }

    // ===== FAVORITES =====
    @PostMapping("/favorites/{adId}")
    @Operation(summary = "Add ad to favorites")
    public ResponseEntity<Void> addFavorite(
            @PathVariable Long adId,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        userService.addFavorite(userId, adId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/favorites/{adId}")
    @Operation(summary = "Remove ad from favorites")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long adId,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        userService.removeFavorite(userId, adId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    @Operation(summary = "Get user favorites")
    public ResponseEntity<List<Ad>> getFavorites(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(userService.getFavorites(userId));
    }

    @GetMapping("/favorites/{adId}/check")
    @Operation(summary = "Check if ad is in favorites")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long adId,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(userService.isFavorite(userId, adId));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}