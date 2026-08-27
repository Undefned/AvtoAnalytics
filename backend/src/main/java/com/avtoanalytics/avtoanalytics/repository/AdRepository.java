package com.avtoanalytics.avtoanalytics.repository;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long>, JpaSpecificationExecutor<Ad> {
    List<Ad> findBySeller(User seller);
    List<Ad> findByStatus(Ad.Status status);
    
    @Query("SELECT AVG(a.price) FROM Ad a WHERE a.car.id = :carId AND a.status = 'ACTIVE'")
    Double findAveragePriceByCarId(@Param("carId") Long carId);
}