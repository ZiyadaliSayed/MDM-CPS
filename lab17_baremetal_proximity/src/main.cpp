#include <Arduino.h>
#include <Arduino_APDS9960.h>
#include <nrf.h>

int pulse_count = 0;
bool green_on = false;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT); pinMode(LEDR, OUTPUT); pinMode(LEDG, OUTPUT);
  digitalWrite(LEDR, LOW); digitalWrite(LEDG, HIGH);
  APDS.begin();

  NRF_TIMER4->MODE = TIMER_MODE_MODE_Counter;
  NRF_TIMER4->BITMODE = TIMER_BITMODE_BITMODE_32Bit;
  NRF_TIMER4->TASKS_START = 1;
}

void loop() {
  if (APDS.proximityAvailable()) {
    if (APDS.readProximity() > 100) { 
      NRF_TIMER4->TASKS_COUNT = 1; 
      pulse_count++;
      
      digitalWrite(LED_BUILTIN, HIGH); delay(150);
      digitalWrite(LED_BUILTIN, LOW); delay(350); 
      
      if (pulse_count >= 15 && !green_on) {
        digitalWrite(LEDG, LOW); 
        green_on = true;
      }
    }
  }
}
