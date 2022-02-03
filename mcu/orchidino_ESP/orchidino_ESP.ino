


/*********************
 * This file is the main entry point for the sensor module.
 * Connection to the ESP8266 was based on https://tttapa.github.io/ESP8266/Chap07%20-%20Wi-Fi%20Connections.html
 *********************/
#include <ESP8266WiFi.h>        // Include the Wi-Fi library

#include <DHT.h>
#include "constants.h"          // Contains Wi-Fi ssid and password

#define DHTTYPE DHT11

#define DHT_SENSOR_PIN 2        // NOTE: D4 on ESP8266 NodeMCU is GPIO2

const char* ssid     = const_ssid;         // The SSID (name) of the Wi-Fi network you want to connect to
const char* password = const_password;     // The password of the Wi-Fi network

DHT dht(DHT_SENSOR_PIN, DHTTYPE);
unsigned long lastMillis = 0;              // To be used as timer for sending temp/humidity/light at regular interval

void setup() {
  Serial.begin(9600);         // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println('\n');
  dht.begin();
  
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
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  Serial.print(humidity);
  Serial.print("   ");
  Serial.println(temperature);

  // if( measure_environment( &temperature, &humidity ) == true )
  // {
  //   Serial.print( "T = " );
  //   Serial.print( temperature, 1 );
  //   Serial.print( " deg. C, H = " );
  //   Serial.print( humidity, 1 );
  //   Serial.println( "%" );
  // }

  delay(2000);

  // Every 5 minutes send request to POST http://localhost:4000/measurements
  int minutes = 1;
  if (millis() - lastMillis >= minutes*60*1000UL) {
    lastMillis = millis();  //get ready for the next iteration
    Serial.println("hello");

    // sendNewReading();
  }
}
