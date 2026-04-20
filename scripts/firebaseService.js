// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3-HP9p01NwUW1DNVaoM4uSYigTFz8Rrw",
    authDomain: "lacs-room-control-system.firebaseapp.com",
    databaseURL: "https://lacs-room-control-system-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lacs-room-control-system",
    storageBucket: "lacs-room-control-system.firebasestorage.app",
    messagingSenderId: "398855518916",
    appId: "1:398855518916:web:d41bd0975b543fa73b6791"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

console.log(firebaseConfig);

const temperatureValue = document.getElementById("temperature-value");
const humidityValue = document.getElementById("humidity-value");
const ledStripButton = document.getElementById("rgb-led-strip");
const pirSensorButton = document.getElementById("pir-sensor-module");
const loginButton = document.getElementById("login-button");
const authInterface = document.querySelector(".auth-block");

const temperatureRef = db.ref('device/lacs_esp32/sensors/temperature');
const humidityRef = db.ref('device/lacs_esp32/sensors/humidity');
const ledStripRef  = db.ref('device/lacs_esp32/control/led_strip/state');
const pirSensorRef = db.ref('device/lacs_esp32/control/pir_module/state');

let ledStripState;
let pirSensorState;

async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log("User logged in: ", userCredential.user);
        authInterface.style.display = "none";
    } catch (error) {
        console.error("Login error: ", error);
        window.alert("Login error: ", error);
    }
}

loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Attempting to log in with email: ", email);
    await login(email, password);
});

temperatureRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(`Temperature: ${data}`);
    if(data === null || data === undefined){
        temperatureValue.textContent = "N/A";
    }
    temperatureValue.textContent = data;
});

humidityRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(`Humidity: ${data}`);
    if(data === null || data === undefined){
        humidityValue.textContent = "N/A";
    }
    humidityValue.textContent = data;
});

ledStripRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("Strip state is ", data);
    ledStripState = data;
    modifyButtonProperties(ledStripButton, ledStripState);
});

ledStripButton.addEventListener('mouseenter', function(){
    ledStripButton.style.backgroundColor = (ledStripState) ? "rgb(255, 155, 155)" : "rgb(155, 255, 155)";
    ledStripButton.style.color = "rgb(25, 25, 25)";
});

ledStripButton.addEventListener('mouseleave', function(){
    ledStripButton.style.backgroundColor = "";
    ledStripButton.style.color = "";
});

ledStripButton.addEventListener('click', function(){
    try {
        updateComponentState(ledStripRef, ledStripState, ledStripButton);
        console.log("Strip state was updated successfully...");
    } catch (error) {
        window.alert("Something went wrong => ", error); 
    }
});

function modifyButtonProperties(button, state){
    button.textContent = (state) ? "Deactivate" : "Activate";
}

function updateComponentState(componentRef, currentState, buttonRef){
    const newState = !currentState;
    componentRef.set(newState);
    buttonRef.style.backgroundColor = (newState) ? "rgb(255, 155, 155)" : "rgb(155, 255, 155)";
}













