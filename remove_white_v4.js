const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'C:\\Users\\Valeria\\.gemini\\antigravity\\brain\\b2dbd842-19b3-41b7-87ad-a8d7ab10dd34\\media__1774178046592.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\manzanilla.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      const data = this.data;
      
      // Stop walking if we hit stay in ANY color that isn't almost pure white
      const isWall = (idx) => {
          return data[idx] < 248 || data[idx+1] < 248 || data[idx+2] < 248;
      };

      const setTransparent = (idx) => { data[idx+3] = 0; };

      const visited = new Uint8Array(width * height);
      const queue = [];
      
      // Seeds from corners
      queue.push(0, 0); queue.push(width-1, 0); queue.push(0, height-1); queue.push(width-1, height-1);

      let head = 0;
      while(head < queue.length) {
          const x = queue[head++];
          const y = queue[head++];
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
      console.log('SURGICAL CLEANUP V4 FINISHED');
  })
  .on('error', err => console.error(err));
