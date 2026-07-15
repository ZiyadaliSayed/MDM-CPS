#include <ArduinoBLE.h>
#include <Arduino_APDS9960.h>

// Custom UUIDs for our game controller service
BLEService gestureService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLEByteCharacteristic gestureChar("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  
  if (!BLE.begin()) {
    Serial.println("Starting BLE failed!");
    while (1);
  }
  
  if (!APDS.begin()) {
    Serial.println("Error initializing APDS9960 sensor!");
    while (1);
  }

  // Set up BLE Peripheral
  BLE.setLocalName("NanoGesture");
  BLE.setAdvertisedService(gestureService);
  gestureService.addCharacteristic(gestureChar);
  BLE.addService(gestureService);

  gestureChar.writeValue(0); // Initial value
  BLE.advertise();
  Serial.println("BLE Game Controller Active. Waiting for connections...");
}

void loop() {
  BLEDevice central = BLE.central();

  if (central) {
    Serial.println("Connected to browser!");
    
    while (central.connected()) {
      // Check if a gesture is detected
      if (APDS.gestureAvailable()) {
        int gesture = APDS.readGesture();
        
        switch (gesture) {
          case GESTURE_UP:
            gestureChar.writeValue('U');
            Serial.println("Up");
            break;
          case GESTURE_DOWN:
            gestureChar.writeValue('D');
            Serial.println("Down");
            break;
          case GESTURE_LEFT:
            gestureChar.writeValue('L');
            Serial.println("Left");
            break;
          case GESTURE_RIGHT:
            gestureChar.writeValue('R');
            Serial.println("Right");
            break;
          default:
            break;
        }
      }
    }
    Serial.println("Disconnected.");
  }
}