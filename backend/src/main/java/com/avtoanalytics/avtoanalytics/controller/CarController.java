package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.request.FilterRequest;
import com.avtoanalytics.avtoanalytics.dto.response.CarResponse;
import com.avtoanalytics.avtoanalytics.entity.Car;
import com.avtoanalytics.avtoanalytics.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@Tag(name = "Cars", description = "Car catalog endpoints")
public class CarController {

    private final CarService carService;

    @GetMapping
    @Operation(summary = "Get all cars with filters")
    public ResponseEntity<Page<Car>> getCars(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestBody(required = false) FilterRequest filter) {
        return ResponseEntity.ok(carService.getAllCars(filter, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get car by ID")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarResponseById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search cars by make and model")
    public ResponseEntity<List<Car>> searchCars(
            @RequestParam String make,
            @RequestParam String model) {
        return ResponseEntity.ok(carService.getCarsByMakeAndModel(make, model));
    }
}