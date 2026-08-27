package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.request.FilterRequest;
import com.avtoanalytics.avtoanalytics.dto.response.CarResponse;
import com.avtoanalytics.avtoanalytics.entity.Car;
import com.avtoanalytics.avtoanalytics.exception.ResourceNotFoundException;
import com.avtoanalytics.avtoanalytics.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public Page<Car> getAllCars(FilterRequest filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Car> spec = buildSpecification(filter);
        return carRepository.findAll(spec, pageable);
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    public List<Car> getCarsByMakeAndModel(String make, String model) {
        return carRepository.findByMakeAndModel(make, model);
    }

    public CarResponse getCarResponseById(Long id) {
        Car car = getCarById(id);
        return mapToResponse(car);
    }

    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    private Specification<Car> buildSpecification(FilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getMake() != null && !filter.getMake().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("make"), filter.getMake()));
            }

            if (filter.getModel() != null && !filter.getModel().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("model"), filter.getModel()));
            }

            if (filter.getYearFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("year"), filter.getYearFrom()));
            }

            if (filter.getYearTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("year"), filter.getYearTo()));
            }

            if (filter.getBodyType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("bodyType"), filter.getBodyType()));
            }

            if (filter.getTransmission() != null) {
                predicates.add(criteriaBuilder.equal(root.get("transmission"), filter.getTransmission()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private CarResponse mapToResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setId(car.getId());
        response.setMake(car.getMake());
        response.setModel(car.getModel());
        response.setYear(car.getYear());
        response.setEngineVolume(car.getEngineVolume());
        response.setHorsepower(car.getHorsepower());
        response.setTransmission(car.getTransmission() != null ? car.getTransmission().name() : null);
        response.setDriveType(car.getDriveType() != null ? car.getDriveType().name() : null);
        response.setBodyType(car.getBodyType() != null ? car.getBodyType().name() : null);
        response.setDescription(car.getDescription());
        return response;
    }
}