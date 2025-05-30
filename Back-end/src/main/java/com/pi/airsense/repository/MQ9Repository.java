package com.pi.airsense.repository;

import com.pi.airsense.model.MQ9Data;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MQ9Repository extends MongoRepository<MQ9Data, String> {
    List<MQ9Data> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
}
