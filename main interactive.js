// number of individuals
let ballNum = window.localStorage.getItem('num');
let baller = document.getElementById('num');
baller.value = ballNum;
if(ballNum > 2000){
  ballNum = 2000;
  document.getElementById('num').value = 2000;
}

baller.addEventListener("keyup", function(){
  baller = document.getElementById('num');
  ballNum = baller.value;
  window.localStorage.setItem('num', ballNum);
})

// total individuals -- original method -- does not work in chrome :(
// const ballNum = document.querySelector("input").value;

// level of virility
let sliderVal = window.localStorage.getItem("mySlider");
let slider = document.getElementById("mySlider");
slider.value = sliderVal;
var output = document.getElementById("Slider");
output.innerHTML = slider.value;
const virility = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
  slider = document.getElementById("mySlider");
  sliderVal = slider.value;
  window.localStorage.setItem("mySlider", sliderVal);
}

// fatality percentage
let fatalSliderVal = window.localStorage.getItem("fatalSlider");
let fatalSlider = document.getElementById("fatalSlider");
fatalSlider.value = fatalSliderVal;
var fataloutput = document.getElementById("fatalSliderSpan");
fataloutput.innerHTML = fatalSlider.value;
const fatalities = fatalSlider.value;

fatalSlider.oninput = function() {
  fataloutput.innerHTML = this.value;
  slider = document.getElementById("fatalSlider");
  fatalSliderVal = fatalSlider.value;
  window.localStorage.setItem("fatalSlider", fatalSliderVal);
}

// sick counter
const paraSick = document.querySelector('p.sick');
let countSick = 1;

paraSick.textContent = 'Sick: ' + countSick;

// healthy counter
const paraHealthy = document.querySelector('p.healthy');
let countHealthy = ballNum - 1;

paraHealthy.textContent = 'Healthy: ' + countHealthy;

//recovered counter
const paraRecovered = document.querySelector('p.recovered');
let countRecovered = 0;
let countDead = 0;

const paraDead = document.querySelector('p.deceased');
paraDead.textContent = 'Deceased: ' + countDead;

paraRecovered.textContent = 'Recovered: ' + countRecovered;

// recovery time/dying time
let recovery = 0;

let recoValue = window.localStorage.getItem('recovery');
let reco = document.getElementById('recovery');
reco.value = recoValue;

reco.addEventListener("input", function(){
  reco = document.getElementById('recovery');
  recoValue = reco.value;
  window.localStorage.setItem('recovery', recoValue);
})

// setting recovery time
if(recoValue === "fast"){
  recovery = 3;
} else if(recoValue === "medium"){
  recovery = 6;
} else {
  recovery = 9;
}

// social distancing
let socialDistance = window.localStorage.getItem('socialDistance');
let sd = document.querySelector('select.socialDistance');
sd.value = socialDistance;

sd.addEventListener("input", function(){
  sd = document.querySelector('select.socialDistance');
  socialDistance = sd.value;
  window.localStorage.setItem('socialDistance', socialDistance);
})

// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//const width = canvas.width = window.innerWidth;
//const height = canvas.height = window.innerHeight;

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  const num = /*Math.floor*/(Math.random()*(max-min)) + min;
  return num;
}

// movement speed
let mvmt = window.localStorage.getItem('speed');
let mvm = document.getElementById('speed');
mvm.value = mvmt;

mvm.addEventListener("input", function(){
  mvm = document.getElementById('speed');
  mvmt = mvm.value;
  window.localStorage.setItem('speed', mvmt);
})

let speed;
if(mvmt === "fast"){
  speed = 5;
} else if(mvmt === "medium"){
  speed = 3;
} else {
  speed = 1;
}

// ball constructor
function Shape(x, y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY);
    this.color = color;
    this.size = size;
  }

// drawing the balls
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

// quarantine measures
let quarantine = window.localStorage.getItem('quarantine');
let quar = document.getElementById('quarantine');
quar.value = quarantine;

if(ballNum > 100){
  window.localStorage.setItem('quarantine', "none");
  document.getElementById('quarantine').style.display = "none";
  quarantine = "none";
} else{
quar.addEventListener("input", function(){
  quar = document.getElementById('quarantine');
  quarantine = quar.value;
  window.localStorage.setItem('quarantine', quarantine);
})
}


  function drawQuar(rectX,rectY,widthRec, heightRec){
    ctx.beginPath();
    ctx.rect(rectX, rectY, widthRec, heightRec);
    ctx.strokeStyle = "#CC00FF";
    ctx.stroke();
  }

// moving the ball
Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
      this.x = width - this.size;
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
      this.x = this.size;
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
      this.y = height - this.size;
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
      this.y = this.size;
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }

// animating balls
let balls = [];
let size = 8;

// creating all balls
while (balls.length < ballNum) { //number of individuals; can be changed
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-speed,speed),
    random(-speed,speed),
    true,
    'rgb(34,139,34)',
    size
  );
  balls.push(ball);
}

// sick individual
balls[0] = new Ball(
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-speed,speed),
    random(-speed,speed),
    true,
    'rgb(128,0,0)',
    size
);
const ballZero = new Date();
balls[0].time = ballZero.getMinutes()*60 + ballZero.getSeconds() + ballZero.getMilliseconds()/1000;

// social distancing measures
if(socialDistance === "light"){
  for(let i = 1; i < balls.length*.25; i++){
    balls[i].velX = 0;
    balls[i].velY = 0;
  }
} else if(socialDistance === "moderate"){
  for(let i = 1; i < balls.length*.6; i++){
    balls[i].velX = 0;
    balls[i].velY = 0;
  }
} else if(socialDistance === "extreme"){
  for(let i = 1; i < balls.length*.85; i++){
    balls[i].velX = 0;
    balls[i].velY = 0;
  }
}

            //bouncing ball stuff
            function ballToBallAngle(ball1,ball2) {
              return Math.atan2(ball2.y-ball1.y,ball2.x-ball1.x)
          }

          function calcNormalFromAngle(angle){
            return [
              Math.cos(angle),
              Math.sin(angle)
            ]
          }

          function ballToBallDistance(ball1, ball2) {
            return Math.sqrt((Math.pow(ball2.x - ball1.x, 2) + Math.pow(ball2.y - ball1.y, 2)));
          }
          function bounceBall(ball, angle) {
            let normal = calcNormalFromAngle(angle)
            let velocity = [ball.velX, ball.velY]
          
            let ul = dotproduct(velocity, normal) / dotproduct(normal, normal)
            let u = [
              normal[0] * ul,
              normal[1] * ul
            ]
          
            let w = [
              velocity[0] - u[0],
              velocity[1] - u[1]
            ]
          
            let new_velocity = [
              w[0] - u[0],
              w[1] - u[1]
            ]
          
            ball.velX = new_velocity[0]
            ball.velY = new_velocity[1]
          }
          
          function dotproduct(a, b) {
            return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n)
          }

function loop() {
    ctx.fillStyle = 'rgb(255,250,250)';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      
      Ball.prototype.collisionDetect = function() {
        for (let j = 0; j < balls.length; j++) {
          if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(quarantine === "draconian"){
              let rectX = width/3;
              drawQuar(rectX, 0, 25, height);
              if(this.x + this.size >= rectX && this.x + this.size <= rectX + 40){
                this.velX *= -1;
              }
            }

            // if(quarantine === "moderate"){
            //   let rectX = width/3;
            //   let rectY = height/12;
            //   drawQuar(rectX, rectY, 25, height*.85);
            //   if(this.x >= rectX && this.x <= rectX + 40 && this.y <= rectY && this.y >= rectY){
            //     this.velX *= -1;
            //     this.velY *= -1;
            //   }
            // }

            const prob = Math.floor(Math.random())*100; //creates probability of infection

            if (distance < this.size + balls[j].size) {
              if(ballNum <= 300){
              let intersection = balls[j].size + this.size - ballToBallDistance(balls[j], this);

              // if its greater than 0, they must be colliding
              if (intersection > 0) {
                let angle = ballToBallAngle(balls[j], this);
                let normal = calcNormalFromAngle(angle);
        
                bounceBall(balls[j], angle);
                bounceBall(this, angle + Math.PI)
        
                // set positions so that they are not overlapping anymore
                balls[j].x -= normal[0] * intersection / 2
                balls[j].y -= normal[1] * intersection / 2
        
                this.x += normal[0] * intersection / 2
                this.y += normal[1] * intersection / 2
              }
            }
            if(prob < virility){ //gives prob of 70% infection. Can be changed to whatever
                if(this.color === 'rgb(128,0,0)' && balls[j].color === 'rgb(34,139,34)'){ //shows infection

                        const nowBall = new Date();
                        balls[j].color = this.color = 'rgb(128,0,0)';
                        balls[j].time = nowBall.getMinutes()*60 + nowBall.getMilliseconds()/1000 + nowBall.getSeconds();

                        countHealthy--;
                        countSick++;
                        paraHealthy.textContent = 'Healthy: ' + countHealthy;
                        paraSick.textContent = 'Sick: ' + countSick;
                        }
                    }
                }
            }
        }
      }

      balls[i].collisionDetect();

      let now = new Date();

      if(balls[i].color === 'rgb(128,0,0)' && Math.abs(balls[i].time - (now.getMinutes()*60 + now.getSeconds()+now.getMilliseconds()/1000)) >= recovery) {
          const dead = Math.floor(Math.random()*100);
          if(dead > fatalities){
          balls[i].color = 'rgb(135,206,250)';
          } else {
            balls[i].color = 'rgb(0,0,0)';
            balls[i].velY = 0;
            balls[i].velX = 0;
            countDead++;
            paraDead.textContent = "Deceased: " + countDead
          }
          countSick--;
          countRecovered++;
          paraRecovered.textContent = 'Recovered: ' + Math.abs(countRecovered-countDead);
          paraSick.textContent = 'Sick: ' + countSick;
        }
    }

    requestAnimationFrame(loop);
    
  }

loop();

// button action
const again = document.getElementById("again");
again.onclick = function(){ clicker();}
//again.addEventListener('click', loop);

function clicker() {
  if(ballNum <= 2000){
    location.reload();
  }
}
