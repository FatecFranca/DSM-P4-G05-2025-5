package com.pi.airsense.controller;

import com.pi.airsense.model.DHT11Data;
import com.pi.airsense.model.MQ9Data;
import com.pi.airsense.model.dto.TempDTO;
import com.pi.airsense.model.dto.UmidadeDTO;
import com.pi.airsense.service.DHT11Service;
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
@RequestMapping("/dht11")
public class DHT11Controller {

    @Autowired
    private DHT11Service service;

    @GetMapping
    public ResponseEntity<List<DHT11Data>> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<DHT11Data> dados;

        if (inicio != null && fim != null) {
            dados = service.buscarPorIntervalo(inicio, fim);
        } else {
            dados = service.listarTodos();
        }

        return ResponseEntity.ok(dados);
    }

    @GetMapping("/semana-temp")
    public ResponseEntity<List<TempDTO>> listarTemperaturasPorDiaSemana(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<DHT11Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, DHT11Data::getDataHora);
        List<TempDTO> tempData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDataHora().getDayOfWeek(),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(DHT11Data::getTemperatura)
                ))
                .entrySet().stream()
                .map(entry -> new TempDTO(
                        DataUtil.formatarDiaSemana(entry.getKey()),
                        entry.getValue()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(tempData);
    }

    @GetMapping("/mes-temp")
    public ResponseEntity<List<TempDTO>> listarTemperaturasPorSemana(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<DHT11Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, DHT11Data::getDataHora);
        List<TempDTO> tempData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> "Sem" + DataUtil.getSemanaDoMes(d.getDataHora()),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(DHT11Data::getTemperatura)
                ))
                .entrySet().stream()
                .map(entry -> new TempDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tempData);
    }

    @GetMapping("/semana-umidade")
    public ResponseEntity<List<UmidadeDTO>> listarUmidadePorDiaSemana(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<DHT11Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, DHT11Data::getDataHora);
        List<UmidadeDTO> tempData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDataHora().getDayOfWeek(),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(DHT11Data::getTemperatura)
                ))
                .entrySet().stream()
                .map(entry -> new UmidadeDTO(
                        DataUtil.formatarDiaSemana(entry.getKey()),
                        entry.getValue()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(tempData);
    }


    @GetMapping("/mes-umidade")
    public ResponseEntity<List<UmidadeDTO>> listarUmidadePorSemana(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<DHT11Data> dados = (inicio != null && fim != null)
                ? service.buscarPorIntervalo(inicio, fim)
                : service.listarTodos();
        dados = DataUtil.filtrarComDataValida(dados, DHT11Data::getDataHora);
        List<UmidadeDTO> umidData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> "Sem" + DataUtil.getSemanaDoMes(d.getDataHora()),
                        LinkedHashMap::new,
                        Collectors.averagingDouble(DHT11Data::getUmidade)
                ))
                .entrySet().stream()
                .map(entry -> new UmidadeDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(umidData);
    }

    @PostMapping
    public ResponseEntity<DHT11Data> salvar(@RequestBody DHT11Data dado) {
        DHT11Data salvo = service.salvar(dado);
        return ResponseEntity.status(201).body(salvo);
    }
}
