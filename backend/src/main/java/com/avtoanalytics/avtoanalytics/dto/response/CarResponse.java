package com.avtoanalytics.avtoanalytics.dto.response;

import lombok.Data;

@Data
public class CarResponse {
    private Long id;
    private String make;
    private String model;
    private Integer year;
    private Double engineVolume;
    private Integer horsepower;
    private String transmission;
    private String driveType;
    private String bodyType;
    private String description;
}