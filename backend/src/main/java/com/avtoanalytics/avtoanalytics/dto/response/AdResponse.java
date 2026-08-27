package com.avtoanalytics.avtoanalytics.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer mileage;
    private String city;
    private String address;
    private String status;
    private Integer views;
    private String[] photoUrls;
    private LocalDateTime createdAt;

    // Seller
    private Long sellerId;
    private String sellerName;
    private String sellerPhone;
    private boolean privateSeller;

    // Car
    private Long carId;
    private String carMake;
    private String carModel;
    private Integer carYear;
}