package com.ps013.shipmentservice.repository;

import com.ps013.shipmentservice.entity.Shipment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentRepository
        extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrackingNumber(
            String trackingNumber);

    boolean existsByTrackingNumber(
            String trackingNumber);
}