package com.pi.airsense.model.dto;

import com.pi.airsense.model.enums.TipoAlerta;

public record AlertaDTO(TipoAlerta tipo, Double valorLimite) {}
