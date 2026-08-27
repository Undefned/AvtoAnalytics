package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.response.CarResponse;
import com.avtoanalytics.avtoanalytics.service.ComparisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compare")
@RequiredArgsConstructor
@Tag(name = "Compare", description = "Car comparison endpoints")
public class CompareController {

    private final ComparisonService comparisonService;

    @PostMapping
    @Operation(summary = "Compare cars by ad IDs")
    public ResponseEntity<List<CarResponse>> compareCars(@RequestBody List<Long> adIds) {
        return ResponseEntity.ok(comparisonService.compareCars(adIds));
    }
}