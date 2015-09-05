// organized source code of BLCK4777 (http://www.p01.org/BLCK4777/)
//  for a study to see how a graphics and an audio is generated
ctx = b.getContext('2d');
T = String.fromCharCode;

window.onload = function() {
  createAudio();
  initGraphics();
  update();
}

function createAudio() {
  // header of a wav file
  // linear PCM, monaural, sampling rate 30720Hz, bit/sample 8bit
  audio = "RIFFdataWAVEfmt " + atob("EAAAAAEAAQAAeAAAAHgAAAEACAA") + "data";
  g = 6177;
  h = f = C = 0;
  for (; g > f; h *= f % 1 ? 1 : 0.995) {
    calcFrameValues();
    // 8bit sample value
    audio += T(
      (1 + s * 8) * Math.random() + 
      (1 - s) * (h / 45 * (f * (2 + C / 3 % 1) & 1) + 
      (C > 3) * 8 * (f * (2 + (f / 8 & 3)) % 1)) | 1);
    f += 1 / 512;
  }
  // create Audio and play
  (audio = new Audio("data:Audio/WAV;base64," + btoa(audio))).play();
}

function calcFrameValues() {
  s = Math.pow(Math.min(f / 5457, 1), 87) + 
    Math.pow(1 - Math.min(f / 5457, 1), 8);
  // frame numbers when the large triangle is flashing
  if (f == [1280, 1599, 2175, 2469, 2777, 3183,
            3369, 3995, 4199, 4470, 4777, 5120][C]) {
    C++;
    h = 640;
  }
}

function initGraphics() {
  b.style.background = "radial-gradient(circle,#345,#000)";
  b.style.position = "fixed";
  b.style.height = b.style.width = "100%";
  b.height = 720;
  h = b.style.left = b.style.top = A = f = C = 0;
  // variable `p` manages params of triangles
  // initial entry includes three static large triangles and
  //  a line moving rightward
  //       x, y, vx, vy,    r, color1, color2, idx,
  p = [    0, 0,  0,  0,  180,      2,      0,   1, // triangle 1
        -360, 0,  0,  0,   99,      1,      0,   2, // triangle 2
         360, 0,  0,  0,   99,      1,      0,   3, // triangle 3
       -2880, 0,  0,  0, 1280,      0,   1280,   0];// line
}

function update() {
  requestAnimationFrame(update);
  g = audio.currentTime * 60;
  // sync a graphics and an audio
  for (; g > f; h *= f % 1 ? 1 : 0.995) {
    calcFrameValues();
    // clear a canvas
    b.width = 1280;
    // control a camera
    ctx.translate(640, 360 + h / 45 * Math.random());
    ctx.rotate(A / 5457 - h / 5457);
    ctx.scale(1 + s * 8, 1 + s * 8);
    f++;
    // update all triangles
    i = p.length;
    for (; i; ) {
      y = p[i -= 7];
      x = p[i ^= 1];
      r = p[i + 4];
      l = p[i + 6];
      s = 2 * Math.random() + 1;
      t = s * 4;
      a = 122;
      // is a triangle or a line?
      if (640 > r) {
        // triangle
        // y += vy, reflecting at the edge
        if (!(640 > Math.abs(p[i ^= 1] += p[i + 2]))) {
          p[i + 2] *= -1;
        }
        // x += vx, reflecting at the edge
        if (!(640 > Math.abs(p[i ^= 1] += p[i + 2]))) {
          p[i + 2] *= -1;
        }
        // small triangle flashes occasionally
        t = Math.random() > p[i + 7] ||
        // large triangle flashes at a certain frame
          p[i + 7] == "22312131212313"[C] & h == 640;
        w = x - A;
        // is the static large triangle?
        if (!p[i + 2]) {
          // is colliding with the line?
          if (r * r / 3 > w * w) {
            // add small triangles
            t = s * (r - Math.abs(w)) / 45 + 2;
            a = 2 * Math.random() + 5;
            p.push(A, 0, s * Math.sin(a += 599), s * Math.sin(a - 11),
                   s * t, C + s, 640, 0.995);
            s = 2 * Math.random() + 1;
            a = 2 * Math.random() + 5;
            p.push(A, 0, s * Math.sin(a += 599), s * Math.sin(a - 11),
                   s * t, C + s, 640, 0.995);
            s = 2 * Math.random() + 1;
            a = 2 * Math.random() + 2;
            p.push(A, 0, s * Math.sin(a += 599), s * Math.sin(a - 11),
                   s * t, C + s, 640, 0.995);
          }
        }
        a = p[i + 2] * y / 45;
        l = p[i + 6] = t ? 640 : 0.9 * l;
        t = r;
      } else {
        // line
        // increment a position x of a line
        A = p[i]++;
      }
      // draw a triangle when a graphics and an audio get into sync
      if (!(g > f)) {
        s = r;
        ctx.beginPath();
        ctx.lineTo(x + s * Math.sin(a += 599), y - s * Math.sin(a - 11));
        s = t;
        ctx.lineTo(x + s * Math.sin(a += 599), y - s * Math.sin(a - 11));
        ctx.lineTo(x + s * Math.sin(a += 599), y - s * Math.sin(a - 11));
        ctx.shadowBlur = r;
        s = l;
        x = s * 2;
        a = p[i + 5];
        ctx.shadowColor = ctx.fillStyle = "rgb(" +
          [x + s * Math.sin(a += 599) | 1,
           x + s * Math.sin(a += 599) | 1,
           x + s * Math.sin(a += 599) | 1] + ")";
        ctx.fill();
      }
    }
  }
  ctx.fillText("BLCK4777", 90, 99);
}
