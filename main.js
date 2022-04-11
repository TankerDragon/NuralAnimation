const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;

//////////////////////////////Constant numbers/////////////////////////
const DIRECTION = canvas.height > canvas.width ? canvas.height : canvas.width,
  SPEED = Math.round(DIRECTION / 32),
  WAVE_SPEED = Math.round(DIRECTION / 25),
  RADIOUS = Math.round(DIRECTION / 350),
  WAVE_RADIOUS = Math.round(DIRECTION / 10),
  LINE_WIDTH = Math.round(DIRECTION / 500),
  NUM = Math.round(DIRECTION / 20),
  FPS = 60,
  COLOR = "#00769e",
  BACKGROUND_COLOR = "black",
  LINE_COLOR = "#004a63",
  DISTANCE = Math.round(DIRECTION / 10);

var grd;

class dot {
  ID = null;
  x = Math.round(canvas.width * Math.random());
  y = Math.round(canvas.height * Math.random());
  a = 2 * Math.PI * Math.random();
  xv = Math.round(Math.sin(this.a) * SPEED * Math.random());
  yv = Math.round(Math.cos(this.a) * SPEED * Math.random());
  connected = [];
  update() {
    for (let i = 0; i < NUM; i++) {
      if (
        Math.sqrt(
          Math.pow(dots[i].x - this.x, 2) + Math.pow(dots[i].y - this.y, 2)
        ) < DISTANCE &&
        i != this.ID
      ) {
        this.connected[i] = true;
      } else {
        if (this.connected[i] == true) {
          this.connected[i] = false;
        }
      }
    }
  }
}

class wave {
  x = 0;
  y = 0;
  r = 0;
}

///////////////creating objects//////////////////
dots = [];
waves = [];

for (let i = 0; i < NUM; i++) {
  dots[i] = new dot();
  dots[i].ID = i;
  for (let j = 0; j < NUM; j++) {
    dots[i].connected[j] = false;
  }
}

function addWave(event) {
  for (let i = 0; i <= waves.length; i++) {
    if (waves[i] == null) {
      waves[i] = new wave();
      waves[i].x = event.clientX;
      waves[i].y = event.clientY;
      break;
    }
    if (i == waves.length) {
      waves[i] = new wave();
    }
  }
  console.log(waves);
}

////////////////////main loop///////////////////
function loop() {
  canvas.height = document.documentElement.clientHeight;
  canvas.width = document.documentElement.clientWidth;
  //Background <<<<<<<<<<<<<<<<<
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //>>>>>>>>>>>>>

  //Lines <<<<<<<<<<<<<<<<
  for (let i = 0; i < NUM; i++) {
    dots[i].update();
    for (let j = 0; j < dots[i].connected.length; j++) {
      if (dots[i].connected[j] == true) {
        ctx.globalAlpha =
          1 -
          Math.sqrt(
            Math.pow(dots[i].x - dots[j].x, 2) +
              Math.pow(dots[i].y - dots[j].y, 2)
          ) /
            DISTANCE;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
  //>>>>>>>>>>>>>>>>>>

  //Dots <<<<<<<<<<<<<<<<<<
  for (let i = 0; i < NUM; i++) {
    ctx.fillStyle = COLOR;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(dots[i].x, dots[i].y, RADIOUS, 0, Math.PI * 2);
    ctx.fill();

    dots[i].x += dots[i].xv / FPS;
    dots[i].y += dots[i].yv / FPS;

    if (dots[i].x < -RADIOUS) {
      dots[i].x = canvas.width + RADIOUS;
    }
    if (dots[i].x > canvas.width + RADIOUS) {
      dots[i].x = -RADIOUS;
    }
    if (dots[i].y < -RADIOUS) {
      dots[i].y = canvas.height + RADIOUS;
    }
    if (dots[i].y > canvas.height + RADIOUS) {
      dots[i].y = -RADIOUS;
    }
  }
  // >>>>>>>>>>>>>

  //Waves <<<<<<<<<<<<<<<<<<
  for (let i = 0; i < waves.length; i++) {
    if (waves[i] != null) {
      grd = ctx.createRadialGradient(
        waves[i].x,
        waves[i].y,
        waves[i].r * 0.6,
        waves[i].x,
        waves[i].y,
        waves[i].r
      );
      ctx.globalAlpha = 1 - waves[i].r / WAVE_RADIOUS;
      grd.addColorStop(1, LINE_COLOR);
      grd.addColorStop(0, BACKGROUND_COLOR);

      ctx.beginPath();
      ctx.arc(waves[i].x, waves[i].y, waves[i].r, 0, 2 * Math.PI);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;

      waves[i].r += WAVE_SPEED / FPS;

      if (waves[i].r > WAVE_RADIOUS) {
        waves[i] = null;
      }
    }
  }
  //>>>>>>>>>>>>>>>>>>>>>>
}

setInterval(loop, 1000 / FPS);
