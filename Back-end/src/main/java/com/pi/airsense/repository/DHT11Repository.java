package com.pi.airsense.repository;

import com.pi.airsense.model.DHT11Data;
import com.pi.airsense.model.MQ9Data;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DHT11Repository extends MongoRepository<DHT11Data, String> {
    List<DHT11Data> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
}
