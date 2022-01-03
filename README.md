# Orchidino
### An environmental monitoring experiment

The orchidino is intended to track temperature, humidity, and hours of light in an enclosed orchidarium. The intent is to provide environmental data tracking and provide instantaneouse readings. It uses an ESP8266/NodeMCU microcontroller (MCU) for operating a DHT-11 temperature/humidity sensor and generic photocell. The MCU communicates with a server running Node JS over websockets and HTTP through a Wi-Fi connection. 

The server uses a SQLite3 database to store data readings which are received through HTTP requests. Live sensor readings are received through websockets to be sent to the client front end.

The front end uses React to render the graphs and data tables on the user's browser.

