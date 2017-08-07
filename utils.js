
function managPower(){
    if(isPoweredOn){
        powerOff();
    }
    else{
        powerOn();
    }
}

function onAudioEnded (elm) {
        elm.onended = function() {
            clearPlinkInterval();
            let selectedColorElm = document.querySelector('.'+activeColor);
            selectedColorElm.disabled=false;
        };
}

function clearPlinkInterval (){
        if(plinkAColrInterval) clearInterval(plinkAColrInterval);
}

function connect (){
  navigator.bluetooth.requestDevice({
    filters: [{ services: [0xffe5] }]
  })
  .then(device => {
    device.addEventListener('gattserverdisconnected', onDisconnected)
    return device.gatt.connect();
  })
  .then(server => {
    return server.getPrimaryService(0xffe5);
  })
  .then(service => {
    return service.getCharacteristic(0xffe9);
  })
  .then(characteristic => {
    bulbCharacteristic =characteristic;
    init();
  })
  .catch(error => {
     console.error('Connection failed!', error);
  });
}

function setColor(red, green, blue) {
    let data = new Uint8Array([0x56, red, green, blue, 0x00, 0xf0, 0xaa]);
    return bulbCharacteristic.writeValue(data)
    .catch(err => console.log('Error when writing value! ', err));
}

function setRandomColor(){
    let r=Math.round(Math.random()*256);
    let g=Math.round(Math.random()*256);
    let b=Math.round(Math.random()*256);
    return setColor(r,g,b)
    .then(() => console.log("color is set to " +r , g , b));
}

function DiscoEffect(){
     discoInterval = setInterval(() => setRandomColor() , 10 );
    setTimeout(() => clearInterval(discoInterval),3000)
}

function powerOff() {
  let data = new Uint8Array([0xcc, 0x24, 0x33]);
  return bulbCharacteristic.writeValue(data)
      .catch(err => console.log('Error when switching off! ', err))
      .then(() => {
        isPoweredOn=false;
        switchBtn.innerHTML = "Turn on";
      });
}

function powerOn() {
  let data = new Uint8Array([0xcc, 0x23, 0x33]);
  return bulbCharacteristic.writeValue(data)
      .catch(err => console.log('Error when powering on! ', err))
      .then(() => {
        isPoweredOn=true;
        switchBtn.innerHTML = "Turn off";
      });
}

function onDisconnected(){
    connectBtn.classList.remove(".hidden");
    innercontent.classList.add(".hedden");
}

function init (){
    connectBtn.classList.add("hidden");
    innercontent.classList.remove("hidden");
    
    onAudioEnded(redAudio);
    onAudioEnded(greenAudio);
    onAudioEnded(blueAudio);

    if(isDeviceSuportBLE){
        isPoweredOn=true;
        tryBtn.disabled = true;
        switchBtn.classList.remove("hidden");
        annyangResultAnalize();
    }
    slidsBtns.addEventListener('click', function(ev) {
        manageSlids(ev);
    });

    inner.addEventListener("click",function(ev){
        managColorClick(ev);
    });
}

function listen() {
    annyang.setLanguage('ar-SA');
    annyang.start({ continuous: false});
}

function playAudio(elm){
    elm.play();
}

function plinkAcolor(r,g,b,interval){
   setColor(r,g,b);
   isActive=true;
    plinkAColrInterval = setInterval(() => {
        if(isActive) {
            setColor(0,0,0);
            isActive=false
        }
        else {
            setColor(r,g,b);
            isActive=true;
        }
    },interval)
}

function annyangResultAnalize() {
    annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
            playAudio(goodAudio);
            annyang.abort();
            console.log(userSaid); // sample output: 'hello'
            console.log(commandText); // sample output: 'hello (there)'
            console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
    });

        annyang.addCallback('resultNoMatch', function(userSaid, commandText, phrases) {
            playAudio(badAudio);
            plinkAcolor(255,0,0,500);
            annyang.abort();
            console.log(userSaid); // sample output: 'hello'
            console.log(commandText); // sample output: 'hello (there)'
            console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
            setTimeout(() => clearInterval(plinkAColrInterval),3000);
        });

        annyang.addCallback('error', function() {
            console.log('There was an error!');
        });

        annyang.addCallback('errorNetwork', function() {
            console.log('There was a network  error!');
        });
}

function closeAds(){
    adsContainer.classList.add("hidden");
}

function manageSlids(ev) {
    var currMargin = parseInt(inner.style.marginLeft) || 0;
        if(ev.target.dataset.direction === 'next'){
            if ( Math.abs(currMargin) >= ((numColors - 1) * sizeOfShape )) {
                inner.style.marginLeft = '0px';
            } else {
                inner.style.marginLeft = (currMargin  - sizeOfShape) + 'px';
            }
            if(isDeviceSuportBLE){
                annyang.removeCommands();
            }
            tryBtn.disabled =true;
        }
        else if (ev.target.dataset.direction === 'prev')  {
            if ( Math.abs(currMargin) == 0) {
                inner.style.marginLeft = '-' + sizeOfShape*2 + 'px';
            } else {
                inner.style.marginLeft = (currMargin  + sizeOfShape) + 'px';
            }
            if(isDeviceSuportBLE){
                annyang.removeCommands();
            }
            tryBtn.disabled =true;
        }
        else {
            return 
        }
}


function managColorClick(ev){
     switch(ev.target.dataset.color){
            case 'red':
                activeColor='red';
                if(isDeviceSuportBLE){
                    plinkAcolor(255,0,0,1000);
                    annyang.addCommands({
                    'احمر': DiscoEffect
                    });
                }
                redAudio.play();
                //playAudio(redAudio);
                //ev.target.disabled =true;
                tryBtn.disabled =false;
                break;
            case 'green':
                activeColor='green';
                if(isDeviceSuportBLE){
                    setColor(0,255,0);
                    plinkAcolor(0,255,0,1000);
                    annyang.addCommands({
                    'اخضر': DiscoEffect
                    });
                }
                //ev.target.disabled =true;
                playAudio(greenAudio);
                tryBtn.disabled =false;
                break;
            case 'blue':
                activeColor='blue';
                if(isDeviceSuportBLE){
                    setColor(0,0,255);
                    plinkAcolor(0,0,255,1000);
                    annyang.addCommands({
                        'ازرق': DiscoEffect
                    });
                }
                //ev.target.disabled =true;
                playAudio(blueAudio);
                tryBtn.disabled =false;
                break;
        }
}