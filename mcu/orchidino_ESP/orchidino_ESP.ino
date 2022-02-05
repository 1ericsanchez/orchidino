

/*********************
 * This file is the main entry point for the sensor module.
 * Connection to the ESP8266 was based on https://tttapa.github.io/ESP8266/Chap07%20-%20Wi-Fi%20Connections.html
 *********************/
#include <ArduinoJson.h>                   // For generating JSON objects
#include <ESP8266WiFi.h>                    // Include the Wi-Fi library
#include <ESP8266HTTPClient.h>              // Contains definitions for making HTTP requests
#include <WiFiClient.h>
#include <DHT.h>
#include "constants.h"                      // Contains Wi-Fi ssid and password

#define DHTTYPE DHT22
#define DHT_SENSOR_PIN 2                    // NOTE: D4 on ESP8266 NodeMCU is GPIO2
DHT dht(DHT_SENSOR_PIN, DHTTYPE);

const char* ssid     = const_ssid;          // declared in constants.h
const char* password = const_password;      // declared in constants.h

unsigned long lastMillis = 0;               // To be used as timer for sending temp/humidity/light at regular interval

String serverName = "http://192.168.0.53:4000/measurement";     //Server route for posting measurements

void setup() {
  Serial.begin(9600);                       // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');
  dht.begin();
  
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid); Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.print(++i);
  }

  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float light = analogRead(A0) * (5.0 / 1023.0);      // Reads resistance on A0 and converts to volts.

  Serial.print(humidity);
  Serial.print("   ");
  Serial.print(temperature);
  Serial.print("   ");
  Serial.println(light);
  
  delay(2000);

  // Every 5 minutes send request to POST http://192.168.0.53:4000/measurements
  int minutes = 1;
  int spm = 60;       // Shortens the wait timer during development
  if (millis() - lastMillis >= minutes*spm*1000UL) {
    // allocate the memory for the document
    const size_t CAPACITY = JSON_OBJECT_SIZE(3);
    StaticJsonDocument<CAPACITY> doc;

    // create an object
    JsonObject object = doc.to<JsonObject>();
    object["temperature"] = temperature;
    object["humidity"] = humidity;
    object["light"] = light;

    // serialize the object and send the result to payload
    String payload;
    serializeJson(doc, payload);
    Serial.println(payload);
    
    // TODO: Create HTTP client and start
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);
    // TODO: add response code handling
    Serial.println(httpResponseCode);
    http.end();
    lastMillis = millis();  //get ready for the next iteration
    

    // sendNewReading();
  }
}
