# Orchidino Device

The Orchidino uses an ESP8266 NodeMCU to collect data from the orchidarium and send that data to the Node JS server. The MCU connects through 2.4 GHz Wi-Fi. On a periodic basis, it attemps to send a post request to the Node JS server to the POST /measurements route. Request type is `application/json`. Request body consists of:
```
{
    "temperature": 14.4,
    "humidity": 31.4,
    "light": 19
}
```
## Usage
To use this Arduino package, create a constants.cpp file containing each of the varialbes described in constants.h. Once the ssid and password have been provided through extern consts, orchidino_ESP.ino can be uploaded to an ESP8266 to connect to Wi-Fi.

### Dependencies
* DHT sensor library
* Adafruit Unified Sensor 
* ArduinoJson

## To Do
* Add DHT-11 functionality
  * ~~Set up POST request for storing data~~
  * Add response code handling to post request
* Add photoresistor functionality
* Setup webserver for providing current conditions to clients
* Move server ip address to constants and change routes to use format strings