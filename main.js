// timer
var seconds = 00;
var tens = 00;
var appendSeconds = document.getElementById('seconds');
var appendTens = document.getElementById('tens');
var interval;

function startTimer() {
   tens++;
   if (tens < 9){
      appendTens.innerHTML = '0' + tens;
   }
   if (tens > 9){
      appendTens.innerHTML = tens;
   }
   if (tens > 99){
      seconds++;
      appendSeconds.innerHTML = '0'+seconds;
      tens = 0;
      appendTens.innerHTML = '0' + 0;
   }
   if (seconds > 9){
      appendSeconds.innerHTML = seconds;
   }
}


// set up canvas
const para = document.querySelector('p');
const hitpointValue = document.querySelector('.hpvalue');
const hpMAX = 100;
let hitpoint = hpMAX;
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const container = document.querySelector('.container');


const width = canvas.width = container.clientWidth;
const height = canvas.height = container.clientHeight;


let speed = 3;
function increaseValue() {
   var value = parseInt(document.getElementById('number').value, 10);
   value = isNaN(value) ? 0 : value;
   value++;
   document.getElementById('number').value = value;
   speed = document.getElementById('number').value;
}

function decreaseValue() {
   var value = parseInt(document.getElementById('number').value, 10);
   value = isNaN(value) ? 0 : value;
   value < 1 ? value = 1 : '';
   value--;
   document.getElementById('number').value = value;
   speed = document.getElementById('number').value;
}

// asteroid speed


console.log(speed);



// function to generate random number

function random(min, max) {
   const result = Math.floor(Math.random() * (max - min + 1)) + min;
   if (result !== 0) {
      return result;
   } else {
      return random(min, max);
   }
}

// function to generate random RGB color value

function randomRGB() {
   return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function randomRGBEvilCircle() {
   return `rgb(${random(170, 255)},${random(170, 255)},${random(170, 255)})`;
}

class Shape {
   constructor(x, y, velX, velY) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
   }
}

class Ball extends Shape {
   constructor(x, y, velX, velY, color, size) {

      super(x, y, velX, velY);
      this.color = color;
      this.size = size;
      this.exists = true;
   }

   draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = .3;
      ctx.stroke();
   }

   update() {
      if (this.x + this.size >= width || this.x - this.size <= 0) {
         this.velX = -(this.velX);
         this.color = randomRGB();
      }

      if (this.y + this.size >= height || this.y - this.size <= 0) {
         this.velY = -(this.velY);
         this.color = randomRGB();
      }

      this.x += this.velX;
      this.y += this.velY;
   }

   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
               // this.color = randomRGB();

               this.velX = - this.velX;
               this.velY = - this.velY;
               ball.velX = - ball.velX;
               ball.velY = - ball.velY;

            }
         }
      }
   }

}

class EvilCircle extends Shape {
   constructor(x, y) {
      super(x, y, 20, 20);
      this.color = 'white';
      this.size = 10;

      window.addEventListener('mousemove', e => {
         this.x = e.offsetX;
         this.y = e.offsetY;
      });
      window.addEventListener('touchstart', e => {
         this.x = e.offsetX;
         this.y = e.offsetY;
      });

   }

   draw() {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'rgba(25, 25, 25, 1)';
      ctx.fill();
   }

   checkBounds() {
      if ((this.x + this.size) >= width) {
         this.x -= this.size;
      }

      if ((this.x - this.size) <= 0) {
         this.x += this.size;
      }

      if ((this.y + this.size) >= height) {
         this.x -= this.size;
      }

      if ((this.y - this.size) <= 0) {
         this.x += this.size;
      }
   }

   collisionDetect() {
      for (const ball of balls) {
         if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
               ball.exists = false;
               this.size += 0.8;
               this.color = randomRGBEvilCircle();
               count--;
               para.textContent = `Asteroids: ${count}`;
               
               hitpoint--;
               hitpointValue.textContent = `HP: ${(hitpoint/hpMAX*100).toFixed(0)}`;
               document.getElementById('hp').value=hitpoint/hpMAX*100;
               
            }
         }
      }
   }


}
const balls = [];
let ballNumber = window.prompt('How many asteroids? (max: 999)', 50);
while (balls.length < ballNumber) {
   //asteroid size
   const size = random(5, 12);
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      // initial speed
      random(-speed, speed),
      random(-speed, speed),
      randomRGB(),
      size

   );

   balls.push(ball);
   count++;
   para.textContent = `Asteroids: ${count}`
}

const evil = new EvilCircle(
   random(0, width),
   random(0, height),
);

function loop() {
   if (count === 0) {
      container.classList.remove('active');
      clearInterval(interval);
      alert('The black hole has taken the entire galaxy!!!');
      
      
   }
   else if (hitpoint <= 0){
      clearInterval(interval);
      container.classList.remove('active');
      alert('GAME OVER!!! Too many collisions! The black hole lost all health!!!');
      
   }
   else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      for (const ball of balls) {
         if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
         }
      }
      evil.draw();
      // evil.checkBounds();
      evil.collisionDetect();
      requestAnimationFrame(loop);
      console.log(random(-5, 5) === 0);

   }


}



// loop();
const reset = document.querySelector('.reset');
const startGame = document.querySelector('.start');
startGame.addEventListener('click', (e) => {

   e.preventDefault();
   container.classList.add('active');
   startGame.classList.add('hidden');
   reset.classList.add('show');
   interval = setInterval(startTimer);


   loop();

});


reset.addEventListener('click', () => {
   window.location.reload();
})


