package com.avtoanalytics.avtoanalytics.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "ads")
@Data
@EqualsAndHashCode(callSuper = true)
public class Ad extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    private Integer mileage;                // пробег (км)

    private String city;

    private String address;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private Integer views = 0;

    @Column(name = "photo_urls", columnDefinition = "TEXT[]")
    private String[] photoUrls;             // массив ссылок на фото

    public enum Status {
        ACTIVE, SOLD, ARCHIVED
    }
}