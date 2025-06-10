#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DFRobot_DHT11.h>
#include <WiFiClient.h>
#include <time.h>

#define DHT11_PIN 2
#define MQ9_PIN A0

const char* ssid = "Ramon-2.4G";
const char* password = "batatafrita";
const char* endpointDHT11 = "http://192.168.100.138:8080/dht11";
const char* endpointMQ9 = "http://192.168.100.138:8080/mq9";

DFRobot_DHT11 DHT;

void setup() {
  Serial.begin(115200);
  delay(10);

  WiFi.begin(ssid, password);
  Serial.print("Conectando-se ao Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi conectado!");

  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("Aguardando horário via NTP...");
  while (time(nullptr) < 100000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nHora sincronizada!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    DHT.read(DHT11_PIN);
    float temperatura = DHT.temperature;
    float umidade = DHT.humidity;

    int raw = analogRead(MQ9_PIN);
    float ppm = map(raw, 0, 1023, 0, 1000); // mapeamento simples

    time_t now = time(nullptr);
    struct tm* timeinfo = localtime(&now);
    char isoDate[25];
    strftime(isoDate, sizeof(isoDate), "%Y-%m-%dT%H:%M:%S", timeinfo);

    // === Envio DHT11 ===
    http.begin(client, endpointDHT11);
    http.addHeader("Content-Type", "application/json");
    String jsonDHT = "{\"temperatura\":" + String(temperatura, 1) +
                     ",\"umidade\":" + String(umidade, 1) +
                     ",\"dataHora\":\"" + String(isoDate) + "\"}";
    int httpResponseCode1 = http.POST(jsonDHT);
    Serial.print("DHT11 enviado, status: ");
    Serial.println(httpResponseCode1);
    http.end();

    // === Envio MQ-9 ===
    http.begin(client, endpointMQ9);
    http.addHeader("Content-Type", "application/json");
    String jsonMQ9 = "{\"ppm\":" + String(ppm, 1) +
                     ",\"dataHora\":\"" + String(isoDate) + "\"}";
    int httpResponseCode2 = http.POST(jsonMQ9);
    Serial.print("MQ-9 enviado, status: ");
    Serial.println(httpResponseCode2);
    http.end();
  }

  delay(10000); 
}
