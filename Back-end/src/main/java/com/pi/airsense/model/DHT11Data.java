package com.pi.airsense.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "dht11")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DHT11Data {
    @Id
    private String id;
    private Double temperatura;
    private Double umidade;
    private LocalDateTime dataHora;
}
