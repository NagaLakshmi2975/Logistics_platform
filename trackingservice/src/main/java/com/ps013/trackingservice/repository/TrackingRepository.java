package com.ps013.trackingservice.repository;

import com.ps013.trackingservice.entity.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingRepository extends JpaRepository<Tracking, Long> {

    List<Tracking> findByTrackingNumberOrderByTimestampAsc(String trackingNumber);
}