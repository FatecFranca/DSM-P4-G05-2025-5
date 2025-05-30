package com.pi.airsense.util;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.ChronoField;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.function.Function;

public class DataUtil {

    public static String formatarDiaSemana(DayOfWeek dia) {
        return switch (dia) {
            case MONDAY -> "Seg";
            case TUESDAY -> "Ter";
            case WEDNESDAY -> "Qua";
            case THURSDAY -> "Qui";
            case FRIDAY -> "Sex";
            case SATURDAY -> "Sáb";
            case SUNDAY -> "Dom";
        };
    }

    public static String obterDiaSemana(LocalDateTime dataHora) {
        if (dataHora == null) return "Desconhecido";
        return formatarDiaSemana(dataHora.getDayOfWeek());
    }

    public static int getSemanaDoMes(LocalDateTime data) {
        return data != null ? data.get(ChronoField.ALIGNED_WEEK_OF_MONTH) : -1;
    }

    public static String getMesNome(LocalDateTime data) {
        return data != null
                ? data.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"))
                : "Desconhecido";
    }

    public static <T> List<T> filtrarComDataValida(List<T> lista, Function<T, LocalDateTime> extrairDataHora) {
        if (lista == null) return Collections.emptyList();
        return lista.stream()
                .filter(d -> extrairDataHora.apply(d) != null)
                .toList();
    }

    private DataUtil() {}
}
