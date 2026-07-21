#include <ArduinoBLE.h>

BLEService ledService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLEByteCharacteristic ledChar("19B10001-E8F2-537E-4F6C-D104768A1214", BLEWrite);

void setup() {
  pinMode(LEDR, OUTPUT);
  digitalWrite(LEDR, HIGH);

  BLE.begin();
  BLE.setLocalName("Nano33_RGB");
  BLE.setAdvertisedService(ledService);
  ledService.addCharacteristic(ledChar);
  BLE.addService(ledService);
  BLE.advertise();
}

void loop() {
  BLEDevice central = BLE.central();
  if (central) {
    while (central.connected()) {
      if (ledChar.written()) {
        if (ledChar.value() == 'A') digitalWrite(LEDR, LOW);
        else if (ledChar.value() == 'B') digitalWrite(LEDR, HIGH);
      }
    }
  }
}
