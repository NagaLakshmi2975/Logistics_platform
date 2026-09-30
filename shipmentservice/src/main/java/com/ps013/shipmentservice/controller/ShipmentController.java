package com.ps013.shipmentservice.controller;

import com.ps013.shipmentservice.dto.ShipmentRequest;
import com.ps013.shipmentservice.entity.Shipment;
import com.ps013.shipmentservice.service.ShipmentService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @PostMapping
    public ResponseEntity<Shipment> createShipment(
            @Valid @RequestBody ShipmentRequest request) {

        Shipment shipment = shipmentService.createShipment(
                request.getSenderName(),
                request.getReceiverName(),
                request.getPickupAddress(),
                request.getDeliveryAddress()
        );

        return ResponseEntity.ok(shipment);
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(
                shipmentService.getAllShipments()
        );
    }

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<Shipment> getShipment(
            @PathVariable String trackingNumber) {

        return ResponseEntity.ok(
                shipmentService.getShipmentByTrackingNumber(trackingNumber)
        );
    }

    @PutMapping("/{trackingNumber}/status")
    public ResponseEntity<Shipment> updateStatus(
            @PathVariable String trackingNumber,
            @RequestParam String status) {

        return ResponseEntity.ok(
                shipmentService.updateStatus(
                        trackingNumber,
                        status
                )
        );
    }
}