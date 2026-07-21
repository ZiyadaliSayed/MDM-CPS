#include <Arduino.h>
void setup() {
  pinMode(LEDR, OUTPUT); pinMode(LEDG, OUTPUT); pinMode(LEDB, OUTPUT);
  digitalWrite(LEDR, LOW);  // Turn ON Red
  digitalWrite(LEDG, HIGH); // Turn OFF Green
  digitalWrite(LEDB, HIGH); // Turn OFF Blue
}
void loop() { }
