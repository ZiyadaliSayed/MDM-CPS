#include <mbed.h>

rtos::Thread blink_thread;

void blinker() {
  while (true) {
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    rtos::ThisThread::sleep_for(500);
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  blink_thread.start(blinker);
}
void loop() { delay(1000); }
