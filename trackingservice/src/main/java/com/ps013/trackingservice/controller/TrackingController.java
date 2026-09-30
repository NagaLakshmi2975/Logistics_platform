package com.ps013.trackingservice.controller;

import com.ps013.trackingservice.dto.TrackingRequest;
import com.ps013.trackingservice.entity.Tracking;
import com.ps013.trackingservice.service.TrackingService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping
    public ResponseEntity<Tracking> addTrackingEvent(
            @Valid @RequestBody TrackingRequest request) {

        Tracking tracking = trackingService.addTrackingEvent(
                request.getTrackingNumber(),
                request.getStatus(),
                request.getLocation()
        );

        return ResponseEntity.ok(tracking);
    }

    @GetMapping("/{trackingNumber}")
    public ResponseEntity<List<Tracking>> getTrackingHistory(
            @PathVariable String trackingNumber) {

        return ResponseEntity.ok(
                trackingService.getTrackingHistory(trackingNumber)
        );
    }
}