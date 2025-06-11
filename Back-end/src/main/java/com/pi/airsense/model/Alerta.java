package com.pi.airsense.model;

import com.pi.airsense.model.enums.TipoAlerta;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "alertas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerta {

    @Id
    private String id;

    private String usuarioId; // ou ObjectId como string

    private TipoAlerta tipo;

    private Double valorLimite;
}
