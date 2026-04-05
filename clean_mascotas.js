const fs = require('fs');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const jpegData = fs.readFileSync('c:\\Users\\Valeria\\Documents\\Mallku\\mascotas.jpg');
const rawImageData = jpeg.decode(jpegData, {useTArray: true});

const w = rawImageData.width;
const h = rawImageData.height;
const data = rawImageData.data;

const visited = new Uint8Array(w * h);
// 2x size needed for queue as we store x,y pairs
let queue = new Uint32Array(w * h * 2); 
let head = 0;
let tail = 0;

// Function to check if color is close to white (background color)
const isWhite = (r, g, b) => r > 210 && g > 210 && b > 210;

// Seed the edges
for (let x = 0; x < w; x++) {
    queue[tail++] = x; queue[tail++] = 0;
    queue[tail++] = x; queue[tail++] = h - 1;
}
for (let y = 0; y < h; y++) {
    queue[tail++] = 0; queue[tail++] = y;
    queue[tail++] = w - 1; queue[tail++] = y;
}

while (head < tail) {
    const x = queue[head++];
    const y = queue[head++];
    const vIdx = y * w + x;

    if (visited[vIdx]) continue;
    visited[vIdx] = 1;

    const dataIdx = (y * w + x) * 4;
    const r = data[dataIdx];
    const g = data[dataIdx + 1];
    const b = data[dataIdx + 2];

    if (isWhite(r, g, b)) {
        data[dataIdx + 3] = 0; // Make pixel transparent
        data[dataIdx] = 0;     // Pre-multiply alpha for cleaner blending
        data[dataIdx+1] = 0;
        data[dataIdx+2] = 0;
        
        if (x + 1 < w) { queue[tail++] = x + 1; queue[tail++] = y; }
        if (x - 1 >= 0) { queue[tail++] = x - 1; queue[tail++] = y; }
        if (y + 1 < h) { queue[tail++] = x; queue[tail++] = y + 1; }
        if (y - 1 >= 0) { queue[tail++] = x; queue[tail++] = y - 1; }
    }
}

// Soften edges (simple 1px blur on alpha channel)
const newAlpha = new Uint8Array(w * h);
for(let y=1; y<h-1; y++){
    for(let x=1; x<w-1; x++){
        let a = data[(y*w+x)*4+3];
        if(a > 0){
            let sum = data[((y-1)*w+x)*4+3] + data[((y)*w+x-1)*4+3] + data[((y)*w+x+1)*4+3] + data[((y+1)*w+x)*4+3];
            if(sum < 1020) {
               data[(y*w+x)*4+3] = Math.max(0, sum / 5);
            }
        }
    }
}

const png = new PNG({ width: w, height: h });
png.data = Buffer.from(data.buffer);
png.pack().pipe(fs.createWriteStream('c:\\Users\\Valeria\\Documents\\Mallku\\mascotas.png'))
   .on('finish', () => console.log('Background removed perfectly!'));
