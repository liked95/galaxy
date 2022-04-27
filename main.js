// set up canvas
const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const container = document.querySelector('canvas');


const width = canvas.width = container.clientWidth;
const height = canvas.height = container.clientHeight;

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
   constructor(x, y, velX, velY){
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
   }

   update() {
      if ((this.x + this.size) >= width) {
         this.velX = -(this.velX);
         this.color = randomRGB();
      }

      if ((this.x - this.size) <= 0) {
         this.velX = -(this.velX);
         this.color = randomRGB();
      }

      if ((this.y + this.size) >= height) {
         this.velY = -(this.velY);
         this.color = randomRGB();
      }

      if ((this.y - this.size) <= 0) {
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
              ball.color = this.color = randomRGB();
            }
         }
      }
   }

}

class EvilCircle extends Shape {
   constructor(x,y){
      super(x, y, 20, 20);
      this.color = 'white';
      this.size = 10;

      window.addEventListener('mousemove', e =>{
         this.x = e.offsetX;
         this.y = e.offsetY;    
      });
      window.addEventListener('touchstart', e =>{
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
              count--;
              this.color = randomRGB();
              para.textContent = `Ball count: ${count}`
            }
         }
      }
   }


}
const balls = [];
let ballNumber = 100;
while (balls.length < ballNumber) {
   const size = random(10,20);
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
  count++;
  para.textContent = `Ball count: ${count}`

}

const evil = new EvilCircle(
   random(0, width),
   random(0, height),
);

function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   for (const ball of balls) {
      if (ball.exists){
         ball.draw();
         ball.update();
         ball.collisionDetect();    
      }
   }
   evil.draw();
   // evil.checkBounds();
   evil.collisionDetect();
   requestAnimationFrame(loop);
}



// loop();

const startGame = document.querySelector('.start');
startGame.addEventListener('click', (e) => {
   e.preventDefault();
   loop();
   startGame.textContent = 'Increase speed';
})

const stopGame = document.querySelector('.stop');
stopGame.addEventListener('click', ()=>{
   cancelAnimationFrame(loop);
})



function updateNumber(){
   const changeNumber = document.querySelector('.change-number');
   changeNumber.addEventListener('click', () => {
      ballNumber = window.prompt('How many asteroids do you want?', '100');
      loop();
   });
}

updateNumber();


