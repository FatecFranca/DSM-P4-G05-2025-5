package com.pi.airsense.service;

import com.pi.airsense.model.Alerta;
import com.pi.airsense.model.enums.TipoAlerta;
import com.pi.airsense.repository.AlertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final AlertaRepository alertaRepository;
    private final UserService userService;

    public Alerta salvarOuAtualizar(TipoAlerta tipo, Double valorLimite) {
        String usuarioId = userService.getIdUsuarioLogado();

        Alerta alerta = alertaRepository.findByUsuarioIdAndTipo(usuarioId, tipo)
                .orElse(Alerta.builder().usuarioId(usuarioId).tipo(tipo).build());

        alerta.setValorLimite(valorLimite);
        return alertaRepository.save(alerta);
    }

    public List<Alerta> listar() {
        String usuarioId = userService.getIdUsuarioLogado();
        return alertaRepository.findByUsuarioId(usuarioId);
    }
}
