package com.pi.airsense.controller;

import com.pi.airsense.model.Alerta;
import com.pi.airsense.model.dto.AlertaDTO;
import com.pi.airsense.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;

    @PostMapping
    public ResponseEntity<Alerta> criarOuAtualizar(@RequestBody AlertaDTO dto) {
        Alerta alerta = alertaService.salvarOuAtualizar(dto.tipo(), dto.valorLimite());
        return ResponseEntity.ok(alerta);
    }

    @GetMapping
    public ResponseEntity<List<Alerta>> listar() {
        return ResponseEntity.ok(alertaService.listar());
    }
}
