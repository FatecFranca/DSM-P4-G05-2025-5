package com.pi.airsense.service;

import com.pi.airsense.model.MQ9Data;
import com.pi.airsense.repository.MQ9Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MQT9Service {

    @Autowired
    private MQ9Repository repository;

    public List<MQ9Data> listarTodos() {
        return repository.findAll();
    }

    public MQ9Data salvar(MQ9Data dado) {
        return repository.save(dado);
    }

    public List<MQ9Data> buscarPorIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByDataHoraBetween(inicio, fim);
    }
}
