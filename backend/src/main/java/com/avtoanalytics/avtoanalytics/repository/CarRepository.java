package com.avtoanalytics.avtoanalytics.repository;

import com.avtoanalytics.avtoanalytics.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    List<Car> findByMakeAndModel(String make, String model);
    List<Car> findByMake(String make);
}