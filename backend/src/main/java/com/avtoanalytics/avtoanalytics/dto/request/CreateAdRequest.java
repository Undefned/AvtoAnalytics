package com.avtoanalytics.avtoanalytics.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateAdRequest {
    @NotNull
    private Long carId;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    @Positive
    private Integer mileage;

    private String city;

    private String address;

    private String[] photoUrls;
}