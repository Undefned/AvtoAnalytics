package com.avtoanalytics.avtoanalytics.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "avto_analytics_favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "ad_id"})
})
@Data
@EqualsAndHashCode(callSuper = true)
public class Favorite extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", nullable = false)
    private Ad ad;
}