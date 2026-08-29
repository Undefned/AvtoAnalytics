package com.avtoanalytics.avtoanalytics.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "avto_analytics_cars")
@Data
@EqualsAndHashCode(callSuper = true)
public class Car extends BaseEntity {

    @Column(nullable = false)
    private String make;                    // марка

    @Column(nullable = false)
    private String model;                   // модель

    private Integer year;

    @Column(name = "engine_volume")
    private Double engineVolume;            // объём двигателя (л)

    @Column(name = "horsepower")
    private Integer horsepower;             // л.с.

    @Enumerated(EnumType.STRING)
    private Transmission transmission;      // коробка

    @Enumerated(EnumType.STRING)
    @Column(name = "drive_type")
    private DriveType driveType;            // привод

    @Enumerated(EnumType.STRING)
    @Column(name = "body_type")
    private BodyType bodyType;              // кузов

    @Column(columnDefinition = "TEXT")
    private String description;             // описание модели (для отзывов)

    public enum Transmission {
        AUTOMATIC, MANUAL, CVT, ROBOT
    }

    public enum DriveType {
        FRONT, REAR, ALL
    }

    public enum BodyType {
        SEDAN, SUV, HATCHBACK, WAGON, COUPE, CABRIOLET, MINIVAN, PICKUP
    }
}