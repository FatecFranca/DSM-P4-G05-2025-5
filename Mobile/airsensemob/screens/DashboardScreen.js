// === DashboardScreen.js (React Native) ===

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import axios from "../api/axios";
import { useAuth } from "../auth/AuthProvider";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#007AFF",
  },
};

const DashboardScreen = () => {
  const { logout } = useAuth();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [valorAlerta, setValorAlerta] = useState("");
  const [statusAlerta, setStatusAlerta] = useState("");

  const [tempData, setTempData] = useState([]);
  const [umidData, setUmidData] = useState([]);

  const [mostrarDefinirAlerta, setMostrarDefinirAlerta] = useState(false);
  const [tipoAlertaDefinido, setTipoAlertaDefinido] = useState("");
  const [valoresAlertasDefinidos, setValoresAlertasDefinidos] = useState({});
  const [inputValor, setInputValor] = useState("");

  const abrirModalDefinirAlerta = (tipo) => {
    setTipoAlertaDefinido(tipo);
    setMostrarDefinirAlerta(true);
  };

  const salvarAlertaDefinido = () => {
    setValoresAlertasDefinidos((prev) => ({
      ...prev,
      [tipoAlertaDefinido]: parseFloat(inputValor),
    }));
    setInputValor("");
    setMostrarDefinirAlerta(false);
  };

  useEffect(() => {
    axios
      .get("/dht11/semana-temp")
      .then((response) => setTempData(response.data))
      .catch((err) => console.error("Erro ao buscar temperatura:", err));

    axios
      .get("/dht11/semana-umidade")
      .then((response) => setUmidData(response.data))
      .catch((err) => console.error("Erro ao buscar umidade:", err));
  }, []);

  useEffect(() => {
    if (Object.keys(valoresAlertasDefinidos).length === 0) return;

    const alertas = [];
    const temperatura = 28;
    const umidade = 45;
    const qualidade = 75;

    if (
      valoresAlertasDefinidos["Temperatura"] &&
      temperatura > valoresAlertasDefinidos["Temperatura"]
    ) {
      alertas.push({
        tipo: "Temperatura",
        valor: `${temperatura}°C`,
        status: "Alta",
      });
    }

    if (
      valoresAlertasDefinidos["Umidade"] &&
      umidade < valoresAlertasDefinidos["Umidade"]
    ) {
      alertas.push({ tipo: "Umidade", valor: `${umidade}%`, status: "Baixa" });
    }

    if (
      valoresAlertasDefinidos["Qualidade do Ar"] &&
      qualidade > valoresAlertasDefinidos["Qualidade do Ar"]
    ) {
      alertas.push({
        tipo: "Qualidade do Ar",
        valor: qualidade,
        status: "Preocupante",
      });
    }

    let delay = 0;
    alertas.forEach((alerta) => {
      setTimeout(() => {
        setTipoAlerta(alerta.tipo);
        setValorAlerta(alerta.valor);
        setStatusAlerta(alerta.status);
        setMostrarAlerta(true);
      }, delay);
      delay += 4000;
    });
  }, [valoresAlertasDefinidos]);

  const handleLogout = async () => {
    await logout();
  };

  const umidadeChart = {
    labels: umidData.map((d) => d.dia),
    datasets: [
      {
        data: umidData.map((d) => d.umidade),
        color: () => "#00BFFF",
        strokeWidth: 2,
      },
    ],
  };

  const temperaturaChart = {
    labels: tempData.map((d) => d.dia),
    datasets: [
      {
        data: tempData.map((d) => d.temp),
        color: () => "#FF6347",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {mostrarAlerta &&
        Alert.alert(
          `Alerta de ${tipoAlerta}`,
          `Valor atual: ${valorAlerta}\nStatus: ${statusAlerta}`,
          [{ text: "Fechar", onPress: () => setMostrarAlerta(false) }]
        )}

      {tempData.length > 0 && (
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Temperatura (últimos dias)</Text>
          <LineChart
            data={temperaturaChart}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {umidData.length > 0 && (
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Umidade (últimos dias)</Text>
          <LineChart
            data={umidadeChart}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => abrirModalDefinirAlerta("Temperatura")}
        >
          <Image
            source={require("../assets/Tempicon.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Temperatura</Text>
          <Text>28°C</Text>
          <Text style={styles.status}>Moderada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => abrirModalDefinirAlerta("Umidade")}
        >
          <Image
            source={require("../assets/umidicon.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Umidade</Text>
          <Text>58%</Text>
          <Text style={styles.status}>Moderada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => abrirModalDefinirAlerta("Qualidade do Ar")}
        >
          <Image
            source={require("../assets/qualidadeicon.png")}
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>Qualidade do Ar</Text>
          <Text>71</Text>
          <Text style={styles.status}>Preocupante</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={mostrarDefinirAlerta} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text>Definir Alerta de {tipoAlertaDefinido}</Text>
            <TextInput
              style={styles.input}
              placeholder="Valor limite"
              keyboardType="numeric"
              value={inputValor}
              onChangeText={setInputValor}
            />
            <Button title="Salvar" onPress={salvarAlertaDefinido} />
            <View style={styles.modalButton}>
              <Button
                title="Cancelar"
                onPress={() => setMostrarDefinirAlerta(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Button title="Sair" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  chartBox: { marginBottom: 30 },
  chartTitle: { fontSize: 16, marginBottom: 10 },
  chart: { borderRadius: 10 },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#eee",
    padding: 20,
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
    width: 150,
  },
  icon: { width: 60, height: 60, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  status: { color: "#555" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalButton: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});

export default DashboardScreen;
