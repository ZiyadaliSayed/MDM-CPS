#include <ArduinoBLE.h>

BLEService sensorService("181A"); 
BLEByteCharacteristic tempChar("2A6E", BLERead | BLENotify); 

void setup() {
  BLE.begin();
  BLE.setLocalName("Nano33_Sensor");
  BLE.setAdvertisedService(sensorService);
  sensorService.addCharacteristic(tempChar);
  BLE.addService(sensorService);
  tempChar.writeValue(0);
  BLE.advertise();
}

void loop() {
  BLEDevice central = BLE.central();
  if (central) {
    while (central.connected()) {
      tempChar.writeValue(25);
      delay(1000);
    }
  }
}
