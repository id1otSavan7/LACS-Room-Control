require('dotenv').config();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log(firebaseConfig);

const temperatureValue = document.getElementById("temperature-value");
const humidityValue = document.getElementById("humidity-value");
const ledStripButton = document.getElementById("rgb-led-strip");
const pirSensorButton = document.getElementById("pir-sensor-module");

const temperatureRef = db.ref('device/lacs_esp32/sensors/temperature');
const humidityRef = db.ref('device/lacs_esp32/sensors/humidity');
const ledStripRef  = db.ref('device/lacs_esp32/control/led_strip/state');
const pirSensorRef = db.ref('device/lacs_esp32/control/pir_module/state');

let ledStripState;
let pirSensorState;

temperatureRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(`Temperature: ${data}`);
    temperatureValue.textContent = data;
});

humidityRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(`Humidity: ${data}`);
    humidityValue.textContent = data;
});

ledStripRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("Strip state is ", data);
    ledStripState = data;
    modifyButtonProperties(ledStripButton, ledStripState);
});

pirSensorRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("PIR state is ", data);
    pirSensorState = data;
    modifyButtonProperties(pirSensorButton, pirSensorState);
});

ledStripButton.addEventListener('mouseenter', function(){
    ledStripButton.style.backgroundColor = (ledStripState) ? "rgb(255, 155, 155)" : "rgb(155, 255, 155)";
    ledStripButton.style.color = "rgb(25, 25, 25)";
});

ledStripButton.addEventListener('mouseleave', function(){
    ledStripButton.style.backgroundColor = "";
    ledStripButton.style.color = "";
});

pirSensorButton.addEventListener('mouseenter', function(){
    pirSensorButton.style.backgroundColor = (pirSensorState) ? "rgb(255, 155, 155)" : "rgb(155, 255, 155)";
    pirSensorButton.style.color = "rgb(25, 25, 25)";
});

pirSensorButton.addEventListener('mouseleave', function(){
    pirSensorButton.style.backgroundColor = "";
    pirSensorButton.style.color = "";
});

ledStripButton.onclick = function (){
    try {
        updateComponentState(ledStripRef, ledStripState, ledStripButton);
        console.log("Strip state was updated successfully...");
    } catch (error) {
        window.alert("Something went wrong => ", error); 
    }
};

pirSensorButton.onclick = function (){
    try {
        updateComponentState(pirSensorRef, pirSensorState, pirSensorButton);
        console.log("Pir state was updated successfully...");
    } catch (error) {
        window.alert("Something went wrong => ", error);
    }
};

function modifyButtonProperties(button, state){
    button.textContent = (state) ? "Deactivate" : "Activate";
}

function updateComponentState(componentRef, currentState, buttonRef){
    const newState = !currentState;
    componentRef.set(newState);
    buttonRef.style.backgroundColor = (newState) ? "rgb(255, 155, 155)" : "rgb(155, 255, 155)";
}













