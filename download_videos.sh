#!/bin/bash
BASE_URL="https://raw.githubusercontent.com/Vishvambar/Embedded_Systems/main/videos"

declare -A MAPPINGS=(
  ["2"]="lab2_builtin_led"
  ["3"]="lab3_print_serial"
  ["4"]="lab4_rgb_led"
  ["5"]="lab5_accelerometer"
  ["6"]="lab6_gyroscope"
  ["7"]="lab7_imu_tilt_labels"
  ["11"]="lab11_gesture"
  ["12"]="lab12_gesture_web_stream"
  ["13"]="lab13_proximity"
  ["15"]="lab15_sound_threshold"
  ["16"]="lab16_baremetal_timer"
  ["18"]="lab18_rtos_demo"
  ["19"]="lab19_ble_transmission"
  ["20"]="lab20_ble_rgb_control"
)

for NUM in "${!MAPPINGS[@]}"; do
  FOLDER="${MAPPINGS[$NUM]}"
  if [ -d "$FOLDER" ]; then
    echo "Downloading $NUM.mp4 into $FOLDER/..."
    curl -sL "$BASE_URL/$NUM.mp4" -o "$FOLDER/$NUM.mp4"
  fi
done

echo "Finished downloading all matching videos!"
