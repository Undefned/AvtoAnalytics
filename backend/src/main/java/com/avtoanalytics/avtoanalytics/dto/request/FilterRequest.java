package com.avtoanalytics.avtoanalytics.dto.request;

import com.avtoanalytics.avtoanalytics.entity.Car;
import lombok.Data;

@Data
public class FilterRequest {
    private String make;
    private String model;
    private Integer yearFrom;
    private Integer yearTo;
    private Double priceFrom;
    private Double priceTo;
    private Integer mileageFrom;
    private Integer mileageTo;
    private Car.BodyType bodyType;
    private Car.Transmission transmission;
    private Car.DriveType driveType;
    private String city;
    private Boolean privateSellerOnly;
}