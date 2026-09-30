package com.ps013.shipmentservice.service;

import com.ps013.shipmentservice.entity.Shipment;
import com.ps013.shipmentservice.repository.ShipmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(
            ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    // Create shipment
    public Shipment createShipment(
            String senderName,
            String receiverName,
            String pickupAddress,
            String deliveryAddress) {

        String trackingNumber =
                "TRK-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        Shipment shipment = new Shipment(
                trackingNumber,
                senderName,
                receiverName,
                pickupAddress,
                deliveryAddress,
                "CREATED"
        );

        return shipmentRepository.save(shipment);
    }

    // Get all shipments
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    // Get shipment by tracking number
    public Shipment getShipmentByTrackingNumber(
            String trackingNumber) {

        return shipmentRepository
                .findByTrackingNumber(trackingNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Shipment not found"
                        ));
    }

    // Update shipment status
    public Shipment updateStatus(
            String trackingNumber,
            String status) {

        Shipment shipment =
                getShipmentByTrackingNumber(
                        trackingNumber
                );

        shipment.setStatus(status);

        return shipmentRepository.save(shipment);
    }
}