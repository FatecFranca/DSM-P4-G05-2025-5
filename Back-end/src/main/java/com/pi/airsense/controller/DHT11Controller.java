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

import java.time.*;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false, defaultValue = "0") int limit
    ) {
        List<DHT11Data> dados;
        if (inicio != null && fim != null) {
            dados = service.buscarPorIntervalo(inicio, fim);
        } else {
            dados = service.listarTodos();
        }
        dados.sort(Comparator.comparing(DHT11Data::getDataHora).reversed());
        if (limit > 0 && dados.size() > limit) {

            dados = dados.subList(0, limit);
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

        DayOfWeek hoje = getHorarioBR().getDayOfWeek();

        Map<DayOfWeek, Double> agrupado = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDataHora().getDayOfWeek(),
                        Collectors.averagingDouble(DHT11Data::getTemperatura)
                ));

        List<TempDTO> tempData = agrupado.entrySet().stream()
                .sorted(Comparator.comparingInt(entry -> {
                    int diff = entry.getKey().getValue() - hoje.getValue();
                    return diff > 0 ? diff : diff + 7;
                }))
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

        DayOfWeek hoje = getHorarioBR().getDayOfWeek();

        List<UmidadeDTO> tempData = dados.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDataHora().getDayOfWeek(),
                        Collectors.averagingDouble(DHT11Data::getUmidade)
                ))
                .entrySet().stream()
                .sorted(Comparator.comparingInt(entry -> {
                    int diff = entry.getKey().getValue() - hoje.getValue();
                    return diff > 0 ? diff : diff + 7;
                }))
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

    private ZonedDateTime getHorarioBR(){
        return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
    }
}
