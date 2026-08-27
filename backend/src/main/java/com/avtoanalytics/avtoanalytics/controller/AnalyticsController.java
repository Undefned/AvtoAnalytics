package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.response.PriceAnalyticsResponse;
import com.avtoanalytics.avtoanalytics.service.PriceAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Price analytics endpoints")
public class AnalyticsController {

    private final PriceAnalyticsService analyticsService;

    @GetMapping("/ad/{adId}")
    @Operation(summary = "Get price analytics for ad")
    public ResponseEntity<PriceAnalyticsResponse> getAdAnalytics(@PathVariable Long adId) {
        return ResponseEntity.ok(analyticsService.getAnalyticsForAd(adId));
    }

    @GetMapping("/average/{carId}")
    @Operation(summary = "Get average price by car model")
    public ResponseEntity<Double> getAveragePrice(@PathVariable Long carId) {
        return ResponseEntity.ok(analyticsService.getAveragePriceByCarId(carId));
    }
}