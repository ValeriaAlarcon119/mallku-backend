const fs = require('fs');
const { PNG } = require('pngjs');

// Limpieza de precisión: elimina beige en huecos internos
const inputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\cannabis_pre_real.png';
const outputPath = 'c:\\Users\\Valeria\\Documents\\Mallku\\assets\\cannabis_clean.png';

console.log('INTERNAL SURGERY START: Deep cleaning gaps between leaves...');

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
      const width = this.width;
      const height = this.height;
      const data = this.data;

      // Color de referencia (beige/crema)
      const r_bg = data[0];
      const g_bg = data[1];
      const b_bg = data[2];

      const checkColor = (idx) => {
          // Diferencia con el color beige inicial
          const diffR = Math.abs(data[idx] - r_bg);
          const diffG = Math.abs(data[idx+1] - g_bg);
          const diffB = Math.abs(data[idx+2] - b_bg);
          const avg = (data[idx] + data[idx+1] + data[idx+2]) / 3;

          // Si es beige o muy claro (blanco), es fondo.
          // Hojas verdes y semillas marrones son mucho más oscuras o de colores distintos.
          return (diffR < 50 && diffG < 50 && diffB < 50) || avg > 218;
      };

      for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
              let idx = (width * y + x) << 2;
              if (checkColor(idx)) {
                  data[idx+3] = 0; // Transparente total
              }
          }
      }

      this.pack().pipe(fs.createWriteStream(outputPath))
        .on('finish', () => {
             console.log('DEEP SURGERY SUCCESS: All beige gaps are now transparent.');
        });
  })
  .on('error', err => console.error('ERROR during deep surgery:', err));
