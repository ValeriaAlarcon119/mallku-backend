const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\menta.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\menta.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      const data = this.data;
      
      const isWall = (idx) => {
          return data[idx] < 248 || data[idx+1] < 248 || data[idx+2] < 248;
      };

      const setTransparent = (idx) => { data[idx+3] = 0; };

      const visited = new Uint8Array(width * height);
      const queue = [];
      
      // Seeds from corners and edges
      for (let x=0; x<width; x++) { queue.push(x, 0); queue.push(x, height-1); }
      for (let y=0; y<height; y++) { queue.push(0, y); queue.push(width-1, y); }

      let head = 0; headPos = 0;
      while(headPos < queue.length) {
          const x = queue[headPos++];
          const y = queue[headPos++];
          const idx_visited = y * width + x;
          if (visited[idx_visited]) continue;
          visited[idx_visited] = 1;

          let idx = (width * y + x) << 2;

          if (!isWall(idx)) {
              setTransparent(idx);
              if (x + 1 < width) queue.push(x + 1, y);
              if (x - 1 >= 0) queue.push(x - 1, y);
              if (y + 1 < height) queue.push(x, y + 1);
              if (y - 1 >= 0) queue.push(x, y - 1);
          }
      }

      this.pack().pipe(fs.createWriteStream(outputPath));
      console.log('MENTA CLEANUP FINISHED');
  })
  .on('error', err => console.error(err));
