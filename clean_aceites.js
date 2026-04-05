const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\aceites.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\aceites_nobg.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    const w = this.width;
    const h = this.height;
    const data = this.data;

    const visited = new Uint8Array(w * h);
    let queue = new Uint32Array(w * h * 4);
    let head = 0;
    let tail = 0;

    // Background: blurred bokeh - grayish/greenish high brightness, low saturation
    const isBg = (r, g, b) => {
        const brightness = (r + g + b) / 3;
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
        return brightness > 130 && saturation < 0.25;
    };

    // Seed edges
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
        const idx = (y * w + x) << 2;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        if (isBg(r, g, b)) {
            data[idx + 3] = 0;
            data[idx] = data[idx + 1] = data[idx + 2] = 0;
            if (x + 1 < w)  { queue[tail++] = x + 1; queue[tail++] = y; }
            if (x - 1 >= 0) { queue[tail++] = x - 1; queue[tail++] = y; }
            if (y + 1 < h)  { queue[tail++] = x; queue[tail++] = y + 1; }
            if (y - 1 >= 0) { queue[tail++] = x; queue[tail++] = y - 1; }
        }
    }

    // Soften edges
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const a = data[(y * w + x) * 4 + 3];
            if (a > 0) {
                const sum = data[((y-1)*w+x)*4+3] + data[(y*w+x-1)*4+3] +
                            data[(y*w+x+1)*4+3] + data[((y+1)*w+x)*4+3];
                if (sum < 1020) data[(y*w+x)*4+3] = Math.max(0, sum / 5);
            }
        }
    }

    this.pack().pipe(fs.createWriteStream(outputPath))
      .on('finish', () => console.log('✅ Fondo eliminado! Archivo: aceites_nobg.png'));
  })
  .on('error', err => console.error('Error:', err));
