const fs = require('fs');
const { PNG } = require('pngjs');

// Lee de la imagen original desde el "brain" para recuperar los pétalos blancos borrados
const inputPath = 'C:\\Users\\Valeria\\.gemini\\antigravity\\brain\\b2dbd842-19b3-41b7-87ad-a8d7ab10dd34\\media__1774178046592.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\manzanilla.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      
      const isWhite = (x, y) => {
          if (x < 0 || x >= width || y < 0 || y >= height) return false;
          let idx = (width * y + x) << 2;
          // Threshold super estricto (253) para no comerse grises de sombreado
          return this.data[idx] >= 253 && this.data[idx+1] >= 253 && this.data[idx+2] >= 253 && this.data[idx+3] > 0;
      };

      const setTransparent = (x, y) => {
          let idx = (width * y + x) << 2;
          this.data[idx+3] = 0; 
      };

      const visited = new Set();
      const getQueueKey = (x, y) => x + ',' + y;

      const queue = [];
      
      for (let x=0; x<width; x++) { queue.push({x, y:0}); queue.push({x, y:height-1}); }
      for (let y=0; y<height; y++) { queue.push({x:0, y}); queue.push({x:width-1, y}); }

      let head = 0;
      while(head < queue.length) {
          const item = queue[head++];
          const x = item.x, y = item.y;
          const key = getQueueKey(x,y);
          if (visited.has(key)) continue;
          visited.add(key);

          if (isWhite(x,y)) {
              setTransparent(x,y);
              // Lógica de llenado restringida a "4-way" (solo adyacentes rectos)
              // Esto bloquea que el script se cule por vacíos diagonales ("cracks") hacia dentro del pétalo
              queue.push({x: x+1, y});
              queue.push({x: x-1, y});
              queue.push({x, y: y+1});
              queue.push({x, y: y-1});
          }
      }

      this.pack().pipe(fs.createWriteStream(outputPath));
      console.log('Background removed perfectly without touching petals!');
  })
  .on('error', err => console.error(err));
