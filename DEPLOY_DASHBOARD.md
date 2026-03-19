# 🚀 DESPLEGAR DASHBOARD EN VERCEL

## ✅ PREPARACIÓN

Tu dashboard React está en: `mallku-react/`

## PASO 1: Actualizar Dashboard para usar Backend de Render

Abre: `mallku-react/src/components/Dashboard.jsx`

Busca TODAS las líneas con `http://localhost:3000` y cámbialas por:
```
https://mallku-backend.onrender.com
```

Ejemplo (hay ~8 lugares):
```javascript
// ANTES:
const response = await fetch('http://localhost:3000/api/stats');

// DESPUÉS:
const response = await fetch('https://mallku-backend.onrender.com/api/stats');
```

## PASO 2: Build del Dashboard

```powershell
cd c:\Users\Valeria\Documents\Mallku\mallku-react
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados.

## PASO 3: Desplegar en Vercel

### Opción A: CLI (Rápido)

```powershell
npm install -g vercel
cd mallku-react
vercel
```

Sigue las instrucciones en pantalla.

### Opción B: Dashboard Web

1. **Ve a:** https://vercel.com
2. **Sign up** con GitHub
3. **New Project**
4. **Import** el repositorio `mallku-backend`
5. **Root Directory:** Cambiar a `mallku-react`
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. **Deploy**

## PASO 4: Configurar Variables de Entorno (Opcional)

Si quieres usar variables de entorno en lugar de hardcodear la URL:

**En Vercel Dashboard:**
- Settings → Environment Variables
- Agregar: `VITE_API_URL` = `https://mallku-backend.onrender.com`

**En Dashboard.jsx:**
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## ✅ RESULTADO FINAL

Tendrás 3 URLs en producción:
- 🛒 Tienda: https://tienda-mallku.netlify.app
- 🚀 Backend: https://mallku-backend.onrender.com
- 📊 Dashboard: https://mallku-dashboard.vercel.app

---

**NOTA:** Por ahora, el dashboard funcionando en `localhost:5173` es suficiente para demos y testing. Solo tú necesitas verlo.
