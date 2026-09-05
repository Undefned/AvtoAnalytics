package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.response.AdSummaryResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.security.JwtTokenProvider;
import com.avtoanalytics.avtoanalytics.service.MinioService;
import com.avtoanalytics.avtoanalytics.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and favorites endpoints")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final MinioService minioService;

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

    // ===== AVATAR =====
    @PostMapping("/me/avatar")
    @Operation(summary = "Upload user avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        
        String avatarUrl = minioService.uploadFile(file, "Avatars");
        
        User user = userService.getCurrentUser(userId);
        user.setAvatarUrl(avatarUrl);
        userService.updateUser(userId, user);
        
        Map<String, String> response = new HashMap<>();
        response.put("avatarUrl", avatarUrl);
        response.put("message", "Avatar uploaded successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/avatar")
    @Operation(summary = "Delete user avatar")
    public ResponseEntity<Map<String, String>> deleteAvatar(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        User user = userService.getCurrentUser(userId);
        
        if (user.getAvatarUrl() != null) {
            String fileName = user.getAvatarUrl().substring(user.getAvatarUrl().lastIndexOf('/') + 1);
            minioService.deleteFile(fileName);
            user.setAvatarUrl(null);
            userService.updateUser(userId, user);
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar deleted successfully");
        return ResponseEntity.ok(response);
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
    public ResponseEntity<List<AdSummaryResponse>> getFavorites(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        List<Ad> favorites = userService.getFavorites(userId);
        List<AdSummaryResponse> responses = favorites.stream()
            .map(this::mapToAdSummary)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
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
        JwtTokenProvider.JwtPayload payload = jwtTokenProvider.parse(token);
        return payload.userId();
    }

    // ✅ Helper method to map Ad to AdSummaryResponse (using @Data setters)
    private AdSummaryResponse mapToAdSummary(Ad ad) {
        AdSummaryResponse response = new AdSummaryResponse();
        response.setId(ad.getId());
        response.setTitle(ad.getTitle());
        response.setDescription(ad.getDescription());
        response.setPrice(ad.getPrice());
        response.setMileage(ad.getMileage());
        response.setCity(ad.getCity());
        response.setAddress(ad.getAddress());
        response.setStatus(ad.getStatus().name());
        response.setViews(ad.getViews());
        response.setPhotoUrls(ad.getPhotoUrls());
        response.setCreatedAt(ad.getCreatedAt());
        response.setUpdatedAt(ad.getUpdatedAt());
        
        // Car info
        if (ad.getCar() != null) {
            response.setCarId(ad.getCar().getId());
            response.setCarMake(ad.getCar().getMake());
            response.setCarModel(ad.getCar().getModel());
            response.setCarYear(ad.getCar().getYear());
            response.setEngineVolume(ad.getCar().getEngineVolume());
            response.setHorsepower(ad.getCar().getHorsepower());
            if (ad.getCar().getTransmission() != null) {
                response.setTransmission(ad.getCar().getTransmission().name());
            }
        }
        
        // Seller info
        if (ad.getSeller() != null) {
            response.setSellerId(ad.getSeller().getId());
            response.setSellerName(ad.getSeller().getFullName());
            response.setSellerAvatar(ad.getSeller().getAvatarUrl());
        }
        
        return response;
    }
}