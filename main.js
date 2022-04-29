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
let ballNumber = window.prompt('How many asteroid?: ');


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

function randomNumBetween(min, max) {
   return min + Math.random() * (max - min);
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

class Vector {
   constructor(x, y){
      this.x = x;
      this.y = y;
   }

   static add(vector1, vector2) {
      return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
   }
   static sub(vector1, vector2){
      return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
   }
   static mult(vector, scalar){
      return new Vector(vector.x*scalar, vector.y*scalar);
   }
   static div(vector, scalar){
      return new Vector(vector.x/scalar, vector.y/scalar);
   }
   // used to return the length of unit normal and unit tangent vectors
   dot(vector){
      return this.x * vector.x + this.y * vector.y;
   }

   getTangent(){
      return new Vector(-this.y, this.x);
   }
   mag () {
      return Math.sqrt((this.x)**2+(this.y)**2);
   }

   copy(){
      return new Vector(this.x, this.y);
   }
   static random(minX, maxX, minY, maxY) {
      return new Vector(
        randomNumBetween(minX, maxX),
        randomNumBetween(minY, maxY)
      );
    }
}


class Ball {
   constructor(x, y, color) {
      this.pos = new Vector(x,y);
      this.vel = Vector.random(-2, 2, -2, 2);
      this.acc = new Vector(0,0);
      this.radius = random(5, 30);
      this.color = randomRGB();
   }

   update(){
      this.pos = Vector.add(this.pos, this.vel);
      this.vel = Vector.add(this.vel, this.acc);
      this.acc = Vector.mult(this.acc, 0);
   }

   checkCollision(ball) {
      // vector point between the centers of two balls
      const v = Vector.sub(this.pos, ball.pos);
      const dist = v.mag();
      if (dist <= this.radius + ball.radius) {
         const unitNormal = Vector.div(v, dist);
         const unitTangent = unitNormal.getTangent();

         // correct for two randomly generated balls
         const correction = Vector.mult(unitNormal, this.radius + ball.radius);
         const newV = Vector.add(ball.pos, correction);
         this.pos = newV;

         const a = this.vel;
         const b = ball.vel;

         const a_n = a.dot(unitNormal);
         const b_n = b.dot(unitNormal);
         const a_t = a.dot(unitTangent);
         const b_t = b.dot(unitTangent);

         // Calculate after-collision velocities on the a_n and b_n, a_t and b_t remain the same
         const a_n_final = (a_n * (this.radius - ball.radius) +
         2 * ball.radius*b_n) / (this.radius + ball.radius);
         const b_n_final = (b_n * (ball.radius - this.radius) + 
         2 * this.radius * a_n) / (this.radius + ball.radius);

         const a_n_after = Vector.mult(unitNormal, a_n_final);
         const b_n_after = Vector.mult(unitNormal, b_n_final);
         const a_t_after = Vector.mult(unitTangent, a_t);
         const b_t_after = Vector.mult(unitTangent, b_t);

         // merge after collide vector
         const a_after = Vector.add(a_n_after, a_t_after);
         const b_after = Vector.add(b_n_after, b_t_after);

         this.vel = a_after;
         ball.vel = b_after;
      }

   }


   draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
   }

   handleEdges() { //handle edges
      if (this.pos.x + this.radius >= width || this.pos.x - this.radius <= 0) {
         this.vel.x = -(this.vel.x);
         // this.color = randomRGB();
      }

      if (this.pos.y + this.radius >= height || this.pos.y - this.radius <= 0) {
         this.vel.y = -this.vel.y;
         // this.color = randomRGB();
      }    
   }
}

// class EvilCircle extends Shape {
//    constructor(x, y) {
//       super(x, y, 20, 20);
//       this.color = 'white';
//       this.radius = 10;

//       canvas.addEventListener('mousemove', e => {
//          this.x = e.offsetX;
//          this.y = e.offsetY;
//       });
//       canvas.addEventListener('touchstart', e => {
//          this.x = e.offsetX;
//          this.y = e.offsetY;
//       });

//    }

//    draw() {
//       ctx.beginPath();
//       ctx.strokeStyle = this.color;
//       ctx.lineWidth = 3;
//       ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
//       ctx.stroke();
//       ctx.fillStyle = 'rgba(25, 25, 25, 1)';
//       ctx.fill();
//    }

//    checkBounds() {
//       if ((this.x + this.radius) >= width) {
//          this.x = -this.radius;
//       }

//       if ((this.x - this.radius) <= 0) {
//          this.x += this.radius;
//       }

//       if ((this.y + this.radius) >= height) {
//          this.x -= this.radius;
//       }

//       if ((this.y - this.radius) <= 0) {
//          this.x += this.radius;
//       }
//    }

//    collisionDetect() {
//       for (const ball of balls) {
//          if (ball.exists) {
//             const dx = this.x - ball.x;
//             const dy = this.y - ball.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < this.radius + ball.radius) {
//                ball.exists = false;
//                this.radius += 0.8;
//                this.color = randomRGBEvilCircle();
//                count--;
//                para.textContent = `Asteroids: ${count}`;
               
//                hitpoint--;
//                hitpointValue.textContent = `HP: ${(hitpoint/hpMAX*100).toFixed(0)}`;
//                document.getElementById('hp').value=hitpoint/hpMAX*100;
               
//             }
//          }
//       }
//    }
// }
const balls = [];
while (balls.length < ballNumber) {
   //asteroid radius
      const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      // hardcode distance
      random(80, width-80),
      random(80, height-80)
      // initial speed
   );

   console.log(ball)
   

   balls.push(ball);
   count++;
   para.textContent = `Asteroids: ${count}`
}

// const evil = new EvilCircle(
//    random(0, width),
//    random(0, height),
// );

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
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < balls.length; i++) {
         const current =  balls[i];
         const rest = balls.slice(i+1);
         for (let b of rest){
            b.checkCollision(current);
         }
      }

      for (let ball of balls){
         ball.update();
         ball.handleEdges(width, height);
         ball.draw();

      }
      
      // evil.draw();
      // // evil.checkBounds();
      // evil.collisionDetect();
      requestAnimationFrame(loop);
      // console.log(random(-5, 5) === 0);

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


reset.addEventListener('mousedown', (e) => {
   window.location.reload();
})


