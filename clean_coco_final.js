const fs = require('fs');
const { PNG } = require('pngjs');

// Ajustado exactamente para el Coco de Full Spectrum
const inputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\coco_real.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\coco_clean.png';

console.log('SURGERY START: Cleaning Coco background...');

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      const data = this.data;
      
      // Umbral para el blanco del fondo (cuadro blanco)
      const isWall = (idx) => {
          return data[idx] < 240 || data[idx+1] < 240 || data[idx+2] < 240;
      };

      const setTransparent = (idx) => { data[idx+3] = 0; };

      const visited = new Uint8Array(width * height);
      const queue = [];
      
      // Iniciar limpieza desde las 4 esquinas para no tocar el interior
      queue.push(0, 0); 
      queue.push(width-1, 0); 
      queue.push(0, height-1); 
      queue.push(width-1, height-1);

      let headPos = 0;
      while(headPos < queue.length) {
          const x = queue[headPos++];
          const y = queue[headPos++];
          const idx_visited = y * width + x;
          
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          if (visited[idx_visited]) continue;
          visited[idx_visited] = 1;

          let idx = (width * y + x) << 2;

          if (!isWall(idx)) {
              setTransparent(idx);
              queue.push(x + 1, y);
              queue.push(x - 1, y);
              queue.push(x, y + 1);
              queue.push(x, y - 1);
          }
      }

      this.pack().pipe(fs.createWriteStream(outputPath))
        .on('finish', () => {
             console.log('COCO SURGERY SUCCESS: assets/coco_clean.png created');
        });
  })
  .on('error', err => console.error('ERROR during coco surgery:', err));
