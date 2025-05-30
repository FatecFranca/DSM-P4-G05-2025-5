package com.pi.airsense.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DHT11Response {
    private List<TempDTO> tempData;
    private List<UmidadeDTO> umidData;
}