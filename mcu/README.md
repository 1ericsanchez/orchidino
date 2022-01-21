# Orchidino Device

The Orchidino uses an ESP8266 NodeMCU to collect data from the orchidarium and send that data to the Node JS server. The MCU connects through 2.4 GHz Wi-Fi. On a periodic basis, it attemps to send a post request to the Node JS server to the POST /measurements route. Request type is `application/json`. Request body consists of:
```
{
    "temperature": 14.4,
    "humidity": 31.4,
    "light": 19
}
```

## To Do
* Make 2.4 GHz channel on router available
* Add config definitions for wifi connection in ESP file
* Add DHT-11 functionality
* Add photoresistor functionality