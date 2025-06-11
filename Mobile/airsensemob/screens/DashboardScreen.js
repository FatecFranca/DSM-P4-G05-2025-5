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
  SafeAreaView,
  ImageBackground,
} from "react-native";
import axios from "../api/axios";
import { useAuth } from "../auth/AuthProvider";
import { LineChart, BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/MaterialIcons";

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
  paddingRight: 30,
};

const DashboardScreen = () => {
  const { logout, token } = useAuth();
  const [tempData, setTempData] = useState([]);
  const [umidData, setUmidData] = useState([]);

  const [ultimaTemperatura, setUltimaTemperatura] = useState(null);
  const [ultimaUmidade, setUltimaUmidade] = useState(null);
  const [ultimaQualidade, setUltimaQualidade] = useState(null);

  const [alertasConfigurados, setAlertasConfigurados] = useState([]);

  const [mostrarDefinirAlerta, setMostrarDefinirAlerta] = useState(false);
  const [tipoAlertaDefinido, setTipoAlertaDefinido] = useState("");
  const [inputValor, setInputValor] = useState("");

  const abrirModalDefinirAlerta = (tipo) => {
    setTipoAlertaDefinido(validaAlerta(tipo));

    const alertaExistente = alertasConfigurados.find(
      (a) => a.tipo === tipo.toUpperCase().replace(" ", "_")
    );
    setInputValor(alertaExistente?.valorLimite?.toString() || "");
    setMostrarDefinirAlerta(true);
  };

  const validaAlerta = (tipo) => {
    if (tipo.toUpperCase() == "QUALIDADE DO AR") {
      return "QUALIDADE_AR";
    }
    return tipo;
  };

  const salvarAlertaDefinido = async () => {
    try {
      setTipoAlertaDefinido(validaAlerta(tipoAlertaDefinido));
      await axios.post(
        "/alertas",
        {
          tipo: tipoAlertaDefinido.toUpperCase().replace(" ", "_"),
          valorLimite: parseFloat(inputValor),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAlertas();
    } catch (err) {
      console.error("Erro ao salvar alerta:", err);
    }
    setInputValor("");
    setMostrarDefinirAlerta(false);
  };

  const fetchAlertas = async () => {
    try {
      const res = await axios.get("/alertas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertasConfigurados(res.data);
    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
    }
  };

  const buscarLimite = (tipo) => {
    const alerta = alertasConfigurados.find((a) => a.tipo === tipo);
    return alerta?.valorLimite;
  };

  const getStatus = (tipo, valorAtual) => {
    const limite = buscarLimite(tipo);
    if (limite === undefined) return null;
    return valorAtual > limite ? "Dentro da faixa" : "Fora da faixa";
  };

  useEffect(() => {
    fetchAlertas();

    axios
      .get("/dht11/semana-temp")
      .then((response) => setTempData(response.data))
      .catch((err) => console.error("Erro ao buscar temperatura:", err));

    axios
      .get("/dht11/semana-umidade")
      .then((response) => setUmidData(response.data))
      .catch((err) => console.error("Erro ao buscar umidade:", err));

    axios
      .get("/dht11?limit=1")
      .then((res) => {
        const ultimo = res.data[0];
        if (ultimo) {
          setUltimaTemperatura(ultimo.temperatura);
          setUltimaUmidade(ultimo.umidade);
        }
      })
      .catch((err) => console.error("Erro ao buscar último dht11:", err));

    axios
      .get("/mq9?limit=1")
      .then((res) => {
        const ultimo = res.data[0];
        if (ultimo) setUltimaQualidade(ultimo.ppm);
      })
      .catch((err) => console.error("Erro ao buscar último mq9:", err));
  }, []);

  const statusTemperatura = getStatus("TEMPERATURA", ultimaTemperatura);
  const statusUmidade = getStatus("UMIDADE", ultimaUmidade);
  const statusQualidade = getStatus("QUALIDADE_AR", ultimaQualidade);

  const handleLogout = async () => {
    await logout();
  };

  const umidadeChart = {
    labels: umidData.map((d) => d.dia ?? ""),
    datasets: [
      {
        data: umidData.map((d) => Number(d.umidade) || 0),
      },
    ],
  };

  const temperaturaChart = {
    labels: tempData.map((d) => d.dia ?? ""),
    datasets: [
      {
        data: tempData.map((d) => Number(d.temp) || 0),
        color: () => "#FF6347",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
            <Icon name="exit-to-app" size={30} color="#FF4C4C" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {tempData.length > 0 &&
            temperaturaChart.datasets[0].data.some((v) => v > 0) && (
              <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>
                  Temperatura (últimos dias)
                </Text>
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

          {umidData.length > 0 &&
            umidadeChart.datasets[0].data.some((v) => v > 0) && (
              <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Umidade (últimos dias)</Text>
                <BarChart
                  data={umidadeChart}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
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
              <Text>
                {ultimaTemperatura !== null ? `${ultimaTemperatura}°C` : "--"}
              </Text>
              <Text style={styles.status}>{statusTemperatura}</Text>
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
              <Text>{ultimaUmidade !== null ? `${ultimaUmidade}%` : "--"}</Text>
              <Text style={styles.status}>{statusUmidade}</Text>
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
              <Text>{ultimaQualidade !== null ? ultimaQualidade : "--"}</Text>
              <Text style={styles.status}>{statusQualidade}</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={mostrarDefinirAlerta}
            transparent
            animationType="slide"
          >
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
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  logoutIcon: {
    padding: 5,
  },
  chartBox: {
    marginBottom: 30,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "center",
  },
  chart: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
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
