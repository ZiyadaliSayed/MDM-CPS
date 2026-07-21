from flask import Flask
import serial
import threading

app = Flask(__name__)
current_gesture = "Waiting for gesture..."

def read_serial():
    global current_gesture
    try:
        ser = serial.Serial('/dev/ttyACM0', 9600) 
        while True:
            if ser.in_waiting:
                current_gesture = ser.readline().decode('utf-8').strip()
    except Exception as e:
        print(f"Serial Error: {e}")

@app.route('/')
def index():
    return f"""
    <html><head><meta http-equiv="refresh" content="1"></head>
    <body style="font-family: sans-serif; text-align: center; margin-top: 20%;">
        <h1>Latest Gesture from Nano 33 BLE</h1>
        <h2 style="color: #0078D7; font-size: 3em;">{current_gesture}</h2>
    </body></html>
    """

if __name__ == '__main__':
    threading.Thread(target=read_serial, daemon=True).start()
    app.run(port=5000)
