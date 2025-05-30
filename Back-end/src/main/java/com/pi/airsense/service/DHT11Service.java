package com.pi.airsense.service;

import com.pi.airsense.model.DHT11Data;
import com.pi.airsense.repository.DHT11Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DHT11Service {

    @Autowired
    private DHT11Repository repository;

    public List<DHT11Data> listarTodos()
    {
        return repository.findAll();
    }

    public DHT11Data salvar(DHT11Data dado) {
        return repository.save(dado);
    }

    public List<DHT11Data> buscarPorIntervalo(LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByDataHoraBetween(inicio, fim);
    }

}
