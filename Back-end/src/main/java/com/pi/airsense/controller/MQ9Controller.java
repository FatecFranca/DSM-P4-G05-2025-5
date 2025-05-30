package com.pi.airsense.controller;

import com.pi.airsense.model.MQ9Data;
import com.pi.airsense.model.dto.PpmDiaDTO;
import com.pi.airsense.service.MQT9Service;
import com.pi.airsense.util.DataUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mq9")
public class MQ9Controller {

    @Autowired
    private MQT9Service service;

    @GetMapping
    public ResponseEntity<List<MQ9Data>> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<MQ9Data> dados;
        if (inicio != null && fim != null) {
            dados = service.buscarPorIntervalo(inicio, fim);
        } else {
            dados = service.listarTodos();
        }
        return ResponseEntity.ok(dados);
    }

    @GetMapping("/semana")
    public ResponseEntity<List<PpmDiaDTO>> listarPpmPorDiaSemana(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<MQ9Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, MQ9Data::getDataHora);
        List<PpmDiaDTO> ppmData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDataHora().getDayOfWeek(),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(MQ9Data::getPpm)
                ))
                .entrySet().stream()
                .map(entry -> new PpmDiaDTO(
                        DataUtil.formatarDiaSemana(entry.getKey()), // reutiliza seu utilitário
                        entry.getValue()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ppmData);
    }

    @GetMapping("/mes")
    public ResponseEntity<List<PpmDiaDTO>> listarPpmPorSemanaDoMes(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<MQ9Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, MQ9Data::getDataHora);
        List<PpmDiaDTO> ppmData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> "Sem" + DataUtil.getSemanaDoMes(d.getDataHora()),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(MQ9Data::getPpm)
                ))
                .entrySet().stream()
                .map(entry -> new PpmDiaDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ppmData);
    }


    @PostMapping
    public ResponseEntity<MQ9Data> salvar(@RequestBody MQ9Data dado) {
        MQ9Data salvo = service.salvar(dado);
        return ResponseEntity.status(201).body(salvo);
    }
}
