const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\manzanilla.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\manzanilla.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      
      const isWhite = (x, y) => {
          if (x < 0 || x >= width || y < 0 || y >= height) return false;
          let idx = (width * y + x) << 2;
          return this.data[idx] > 220 && this.data[idx+1] > 220 && this.data[idx+2] > 220 && this.data[idx+3] > 0;
      };

      const setTransparent = (x, y) => {
          let idx = (width * y + x) << 2;
          this.data[idx+3] = 0; // alpha to 0
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
              queue.push({x: x+1, y});
              queue.push({x: x-1, y});
              queue.push({x, y: y+1});
              queue.push({x, y: y-1});
              queue.push({x: x+1, y: y+1});
              queue.push({x: x-1, y: y-1});
              queue.push({x: x-1, y: y+1});
              queue.push({x: x+1, y: y-1});
          }
      }

      this.pack().pipe(fs.createWriteStream(outputPath));
      console.log('Background removed perfectly!');
  })
  .on('error', err => console.error(err));
