package com.ps013.trackingservice.service;

import com.ps013.trackingservice.entity.Tracking;
import com.ps013.trackingservice.repository.TrackingRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrackingService {

    private final TrackingRepository trackingRepository;

    public TrackingService(TrackingRepository trackingRepository) {
        this.trackingRepository = trackingRepository;
    }

    public Tracking addTrackingEvent(
            String trackingNumber,
            String status,
            String location) {

        Tracking tracking = new Tracking(
                trackingNumber,
                status,
                location,
                LocalDateTime.now()
        );

        return trackingRepository.save(tracking);
    }

    public List<Tracking> getTrackingHistory(String trackingNumber) {

        return trackingRepository
                .findByTrackingNumberOrderByTimestampAsc(trackingNumber);
    }
}