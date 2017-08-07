'use strict'
// steps :
// 1.Scan for a relevant Device
// 2.Connect to it
// 3.Get the Service you are interested in
// 4.Get the Characteristic you are interested in
// 5.Read, Write or Subscribe to the Characteristic
let  bulbCharacteristic,discoInterval ,plinkAColrInterval,isDeviceSuportBLE , isActive ,activeColor;
let  isPoweredOn = false;
let connectBtn = document.querySelector(".connect");
let switchBtn = document.querySelector(".switch-on-off");
let innercontent = document.querySelector(".inner-content");
let blueAudio = document.querySelector("#blueAudio-f");
let greenAudio = document.querySelector("#greenAudio-f");
let redAudio = document.querySelector("#redAudio-f");
let goodAudio = document.querySelector("#goodAudio-f");
let badAudio = document.querySelector("#badAudio-f");
let tryBtn = document.querySelector(".mic");
let numColors = document.querySelectorAll('.shape').length;
let sizeOfShape = 180;
let inner = document.querySelector('.carousel-inner');
let outer = document.querySelector('.carousel-out');
let slidsBtns = document.querySelector(".slideBtns");
let adsContainer = document.querySelector(".adsContainer");
let showAds = window.localStorage.getItem("show_ads");
let closeBtn = document.querySelector(".closeBtn");

if(!window.navigator.bluetooth) {
        isDeviceSuportBLE =false;
        tryBtn.classList.add("hidden");
        switchBtn.classList.add("hidden");
        init();
}
else {
    // if(!showAds) {
    //         adsContainer.classList.add("hidden");
    // } 
    connectBtn.addEventListener("click",() => {
        isDeviceSuportBLE =true;       
        connect(); 
    });
}

switchBtn.addEventListener("click", () => {
    managPower();
});


tryBtn.addEventListener("click",() => {
    listen();
});

closeBtn.addEventListener("click", () => {
    closeAds();
});
