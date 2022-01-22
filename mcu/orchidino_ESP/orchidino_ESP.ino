#include <ESP8266WiFi.h>        // Include the Wi-Fi library
#include "constants.h"          // Contains Wi-Fi ssid and password
#include "sensor.h"             // Constains functions for collecting data from the DHT-11

const char* ssid     = const_ssid;         // The SSID (name) of the Wi-Fi network you want to connect to
const char* password = const_password;     // The password of the Wi-Fi network

unsigned long lastMillis = 0;              // To be used as timer for sending temp/humidity/light at regular interval

void setup() {
  Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');
  
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid); Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.println(WiFi.status());
    Serial.println(++i);
  }

  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
}

void loop() {
  // Every 5 minutes send request to POST http://localhost:4000/measurements
  if (millis() - lastMillis >= 5*60*1000UL) {
    lastMillis = millis();  //get ready for the next iteration
    Serial.println("hello");

    // sendNewReading();
  }
}
