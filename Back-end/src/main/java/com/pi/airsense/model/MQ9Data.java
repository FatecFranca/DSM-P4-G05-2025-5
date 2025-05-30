package com.pi.airsense.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "mq9")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MQ9Data {
    @Id
    private String id;
    private Double ppm;
    private LocalDateTime dataHora;
}