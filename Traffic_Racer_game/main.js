// ==========================================
// 1. BLUETOOTH SETUP & GESTURE LOGIC
// ==========================================
const connectBtn = document.getElementById('bleConnect');
const serviceUuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
const characteristicUuid = '19b10001-e8f2-537e-4f6c-d104768a1214';

const keys = { w: false, a: false, s: false, d: false };

connectBtn.addEventListener('click', async () => {
    try {
        console.log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'NanoGesture' }],
            optionalServices: [serviceUuid]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);

        await characteristic.startNotifications();
        connectBtn.style.display = 'none'; // Hide button on success
        console.log('Connected! Start swiping.');

        characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value.getUint8(0);
            const gestureChar = String.fromCharCode(value);
            handleGesture(gestureChar);
        });
    } catch (error) {
        console.error("BLE Error:", error);
    }
});

function handleGesture(gesture) {
    // Reset keys to prevent getting stuck
    keys.w = false; keys.a = false; keys.s = false; keys.d = false;
    
    // How long the car drives in the swiped direction (in milliseconds)
    const moveDuration = 400; 
    
    if (gesture === 'U') { 
        keys.w = true; setTimeout(() => keys.w = false, moveDuration); 
    }
    if (gesture === 'D') { 
        keys.s = true; setTimeout(() => keys.s = false, moveDuration); 
    }
    if (gesture === 'L') { 
        keys.a = true; setTimeout(() => keys.a = false, moveDuration); 
    }
    if (gesture === 'R') { 
        keys.d = true; setTimeout(() => keys.d = false, moveDuration); 
    }
}

// Fallback: Keep keyboard controls active for testing
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
});
window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});


// ==========================================
// 2. SCENE, CAMERA, AND RENDERER
// ==========================================
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 30, 150); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); 
dirLight.position.set(20, 40, 20);
scene.add(dirLight);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// ==========================================
// 3. BUILDING THE WORLD & PLAYER
// ==========================================
const roadGeometry = new THREE.PlaneGeometry(24, 300);
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = -50; 
scene.add(road);

const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const playerCar = new THREE.Mesh(carGeometry, carMaterial);
playerCar.position.set(0, 0.5, 5); 
scene.add(playerCar);

camera.position.set(0, 6, 12);
camera.lookAt(playerCar.position);


// ==========================================
// 4. MOVEMENT LOGIC
// ==========================================
const carSpeed = 0.3;
const bounds = { x: 10.5, zMin: -20, zMax: 8 };

function updatePlayerMovement() {
    if (keys.a && playerCar.position.x > -bounds.x) playerCar.position.x -= carSpeed;
    if (keys.d && playerCar.position.x < bounds.x) playerCar.position.x += carSpeed;
    if (keys.w && playerCar.position.z > bounds.zMin) playerCar.position.z -= carSpeed;
    if (keys.s && playerCar.position.z < bounds.zMax) playerCar.position.z += carSpeed;
    
    camera.position.x += (playerCar.position.x - camera.position.x) * 0.1;
}


// ==========================================
// 5. OBSTACLE SPAWNING
// ==========================================
const obstacles = [];
const obstacleGeo = new THREE.BoxGeometry(2, 1, 4);
const obstacleMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });

let frameCount = 0;
const obstacleSpeed = 0.8; 

function spawnObstacle() {
    const obstacle = new THREE.Mesh(obstacleGeo, obstacleMat);
    const randomX = (Math.random() - 0.5) * 20;
    obstacle.position.set(randomX, 0.5, -120);
    scene.add(obstacle);
    obstacles.push(obstacle);
}


// ==========================================
// 6. COLLISION DETECTION & GAME LOOP
// ==========================================
let isGameOver = false;
const playerBoundingBox = new THREE.Box3();
const obstacleBoundingBox = new THREE.Box3();

function animate() {
    if (isGameOver) return; 
    
    requestAnimationFrame(animate);
    updatePlayerMovement();

    frameCount++;
    if (frameCount % 40 === 0) spawnObstacle();

    playerBoundingBox.setFromObject(playerCar); 

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += obstacleSpeed;
        obstacleBoundingBox.setFromObject(obs);

        if (playerBoundingBox.intersectsBox(obstacleBoundingBox)) {
            isGameOver = true;
            document.getElementById('gameOver').style.display = 'block';
        }

        if (obs.position.z > camera.position.z + 10) {
            scene.remove(obs);
            obstacles.splice(i, 1);
        }
    }
    renderer.render(scene, camera);
}

animate();