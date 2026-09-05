package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.request.CreateAdRequest;
import com.avtoanalytics.avtoanalytics.dto.response.AdResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.security.JwtTokenProvider;
import com.avtoanalytics.avtoanalytics.service.AdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
@Tag(name = "Ads", description = "Car ads endpoints")
public class AdController {

    private final AdService adService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    @Operation(summary = "Get all ads with filters")
    public ResponseEntity<Page<AdResponse>> getAds(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adService.getAllAds(city, status, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ad by ID")
    public ResponseEntity<AdResponse> getAdById(@PathVariable Long id) {
        adService.incrementViews(id);
        return ResponseEntity.ok(adService.getAdResponseById(id));
    }

    @PostMapping
    @Operation(summary = "Create new ad")
    public ResponseEntity<AdResponse> createAd(
            @Valid @RequestBody CreateAdRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(adService.createAd(request, userId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update ad")
    public ResponseEntity<AdResponse> updateAd(
            @PathVariable Long id,
            @Valid @RequestBody CreateAdRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(adService.updateAd(id, request, userId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ad")
    public ResponseEntity<Void> deleteAd(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        adService.deleteAd(id, userId);
        return ResponseEntity.noContent().build();
    }

    // ✅ Fixed: Use AdResponse DTOs instead of Ad entities
    @GetMapping("/seller/{userId}")
    @Operation(summary = "Get ads by seller")
    public ResponseEntity<List<AdResponse>> getAdsBySeller(@PathVariable Long userId) {
        List<Ad> ads = adService.getAdsBySeller(userId);
        List<AdResponse> responses = ads.stream()
            .map(adService::convertToResponse)  // ← Use the method name from AdService
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}