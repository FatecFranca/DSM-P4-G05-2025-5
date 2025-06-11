package com.pi.airsense.repository;

import com.pi.airsense.model.Alerta;
import com.pi.airsense.model.enums.TipoAlerta;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AlertaRepository extends MongoRepository<Alerta, String> {
    List<Alerta> findByUsuarioId(String usuarioId);
    Optional<Alerta> findByUsuarioIdAndTipo(String usuarioId, TipoAlerta tipo);
}
