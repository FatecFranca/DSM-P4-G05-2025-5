package com.pi.airsense.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UmidadeDTO {
    private String dia;
    private Double umidade;
}