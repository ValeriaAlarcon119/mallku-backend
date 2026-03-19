# 🚀 GUÍA DE DESPLIEGUE EN RENDER - PASO A PASO

## ✅ PREPARACIÓN COMPLETA

**Estado:** ✅ Código actualizado y listo para deploy

### Cambios realizados:
- ✅ `PORT` dinámico (`process.env.PORT || 3000`)
- ✅ CORS configurado para Netlify y localhost
- ✅ Health check endpoint `/health`
- ✅ Script `start` en package.json
- ✅ `.gitignore` creado

---

## 📝 PASO 1: SUBIR CÓDIGO A GITHUB

### 1.1 Inicializar Git (si no lo has hecho)

Abre PowerShell en la carpeta Mallku:

```powershell
cd c:\Users\Valeria\Documents\Mallku
git init
```

### 1.2 Agregar archivos al staging

```powershell
git add server.js package.json .gitignore
git add README.md NETLIFY_INTEGRATION.md RESUMEN_EJECUTIVO.md test-order.js
```

### 1.3 Hacer commit

```powershell
git commit -m "Backend ready for Render deployment"
```

### 1.4 Crear repositorio en GitHub

1. **Ve a:** https://github.com/new
2. **Nombre del repo:** `mallku-backend`
3. **Configuración:**
   - ✅ Public (o Private si prefieres)
   - ❌ NO marques "Add README" (ya tienes uno)
   - ❌ NO marques ".gitignore" (ya tienes uno)
   - ❌ NO marques "license"
4. **Clic en:** "Create repository"

### 1.5 Conectar y subir

GitHub te mostrará comandos. Usa estos (reemplaza `TU_USUARIO`):

```powershell
git remote add origin https://github.com/TU_USUARIO/mallku-backend.git
git branch -M main
git push -u origin main
```

**Si te pide credenciales:**
- Usuario: tu_usuario_github
- Password: usa un **Personal Access Token** (no tu contraseña)
  - Crea uno aquí: https://github.com/settings/tokens

---

## 🚀 PASO 2: DESPLEGAR EN RENDER

### 2.1 Crear cuenta en Render

1. **Ve a:** https://render.com
2. **Clic en:** "Get Started for Free"
3. **Regístrate con:** GitHub (recomendado) o email

### 2.2 Crear nuevo Web Service

1. **En el Dashboard de Render, clic en:** "New +" (esquina superior derecha)
2. **Selecciona:** "Web Service"
3. **Conecta tu repositorio:**
   - Si usaste GitHub para registrarte, verás tus repos
   - Busca: `mallku-backend`
   - **Clic en:** "Connect"

### 2.3 Configurar el servicio

**IMPORTANTE:** Completa estos campos EXACTAMENTE como se indica:

| Campo | Valor |
|-------|-------|
| **Name** | `mallku-backend` (o el nombre que prefieras) |
| **Region** | `Oregon (US West)` (o la más cercana) |
| **Branch** | `main` |
| **Root Directory** | (déjalo vacío) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` ✅ |

### 2.4 Variables de entorno (opcional por ahora)

Render creará automáticamente `PORT`. No necesitas agregar nada más por ahora.

### 2.5 Desplegar

1. **Clic en:** "Create Web Service" (botón azul al final)
2. **Espera:** 2-3 minutos mientras Render:
   - Clona tu repositorio
   - Ejecuta `npm install`
   - Inicia el servidor con `npm start`

### 2.6 Verificar deployment

Verás logs en tiempo real. Busca estas líneas:

```
==> Building...
npm install
...
==> Starting service...
🌿 Mallku Growth Analytics API running on http://0.0.0.0:10000
✅ Seeded complete analytics database
```

**Si ves eso: ¡ÉXITO!** 🎉

---

## 🔗 PASO 3: OBTENER URL DEL BACKEND

### 3.1 Copiar URL

En el dashboard de Render, verás en la parte superior:

```
https://mallku-backend-XXXX.onrender.com
```

**Copia esa URL completa.**

### 3.2 Probar el backend

Abre en tu navegador:

```
https://mallku-backend-XXXX.onrender.com/health
```

Deberías ver:

```json
{
  "status": "OK",
  "timestamp": "2026-02-09T...",
  "stats": {
    "sales": 50,
    "customers": 6,
    "visits": 100
  }
}
```

**Si ves eso: ¡FUNCIONA!** ✅

---

## 🔧 PASO 4: CONECTAR TIENDA CON BACKEND

### 4.1 Actualizar index.html

Abre `c:\Users\Valeria\Documents\Mallku\index.html`

Busca la **línea 1515** (aproximadamente) y busca:

```javascript
const API_BASE = 'http://localhost:3000/api';
```

**Cámbialo por** (usa TU URL de Render):

```javascript
const API_BASE = 'https://mallku-backend-XXXX.onrender.com/api';
```

### 4.2 Subir cambios a Netlify

```powershell
cd c:\Users\Valeria\Documents\Mallku
git add index.html
git commit -m "Connect to Render backend"
git push
```

Netlify desplegará automáticamente en ~30-60 segundos.

---

## 🧪 PASO 5: PROBAR TODO EL SISTEMA

### 5.1 Hacer pedido de prueba

1. **Ve a tu tienda:** https://tienda-mallku.netlify.app
2. **Agrega productos al carrito**
3. **Completa el checkout**
4. **Verás:**
   - ✅ Email te llegará (Netlify Forms)
   - ✅ WhatsApp se abrirá

### 5.2 Verificar en Dashboard

1. **Actualiza el Dashboard** para que también use Render
   
   Abre: `mallku-react/src/components/Dashboard.jsx`
   
   Busca todas las líneas con `http://localhost:3000` y cámbialas por:
   ```javascript
   https://mallku-backend-XXXX.onrender.com
   ```

2. **Rebuild y deploy del Dashboard**
   
   ```powershell
   cd mallku-react
   npm run build
   ```
   
   Sube la carpeta `dist/` a Vercel/Netlify

3. **Verifica los datos:**
   - ✅ Pedido aparece en "Actividad en Tiempo Real"
   - ✅ Ingresos totales actualizados
   - ✅ Cliente en "Top Customers"

---

## 📊 PASO 6: VERIFICAR EN RENDER (LOGS)

En Render Dashboard → Tu servicio → pestaña "Logs"

Deberías ver líneas como:

```
POST /api/sales 200
POST /api/visit 200
GET /api/stats 200
```

Cada vez que alguien interactúa con tu tienda.

---

## ⚠️ NOTAS IMPORTANTES

### Plan Free de Render:

✅ **Ventajas:**
- Completamente gratis
- Deploy automático desde GitHub
- SSL/HTTPS gratis
- 750 horas/mes gratis

⚠️ **Limitaciones:**
- Se "duerme" después de 15 minutos de inactividad
- Primera petición después de dormirse tarda ~30 segundos en "despertar"
- Los datos en memoria se pierden al reiniciar

### Solución para el problema de "sleep":

**Opción 1: Usar un ping service (GRATIS)**

Crea una cuenta en: https://uptimerobot.com
- Agrega monitor de tipo "HTTP(s)"
- URL: `https://mallku-backend-XXXX.onrender.com/health`
- Intervalo: Cada 5 minutos
- Esto mantiene tu backend siempre despierto

**Opción 2: Upgrade a plan Paid ($7/mes)**
- Nunca se duerme
- Más recursos

### Solución para pérdida de datos:

Para que los datos persistan, necesitas agregar una base de datos:

**MongoDB Atlas (GRATIS):**
```bash
npm install mongoose
```

Ver: `NETLIFY_INTEGRATION.md` sección "Base de Datos Persistente"

---

## 🐛 TROUBLESHOOTING

### Error: "Application failed to respond"

**Causa:** El código tiene un error que impide que el servidor inicie.

**Solución:**
1. Ve a Render → Logs
2. Busca el error exacto
3. Corrígelo en `server.js`
4. Haz commit y push → Render redespliega automáticamente

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa:** La tienda no está en la lista de orígenes permitidos.

**Solución:**
Verifica que `server.js` línea 9 incluya tu URL de Netlify:
```javascript
origin: ['https://tienda-mallku.netlify.app', ...]
```

### Backend funciona en Render pero no desde la tienda

**Causa:** URL mal configurada en `index.html`.

**Solución:**
1. Verifica que la línea 1515 tenga la URL correcta de Render
2. NO olvides `/api` al final
3. Ejemplo correcto: `https://mallku-backend-abc.onrender.com/api`

### Datos desaparecen después de un tiempo

**Causa:** Render reinicia el servicio y la base de datos es in-memory.

**Solución:**
Implementa MongoDB Atlas (ver `NETLIFY_INTEGRATION.md`)

---

## ✅ CHECKLIST FINAL

Antes de considerar que todo está listo:

- [ ] Backend desplegado en Render
- [ ] URL de backend funciona: `/health` responde OK
- [ ] `index.html` actualizado con URL de Render
- [ ] Cambios subidos a Netlify
- [ ] Pedido de prueba desde https://tienda-mallku.netlify.app
- [ ] Pedido aparece en logs de Render
- [ ] Email llegó a tu correo (Netlify Forms)
- [ ] Dashboard actualizado con URL de Render (opcional)
- [ ] (Opcional) UptimeRobot configurado para mantener backend despierto

---

## 🎓 PARA ENTREVISTAS

**Cuando te pregunten:** *"¿Cómo desplegaste tu aplicación full-stack?"*

> "Usé una arquitectura distribuida: frontend en Netlify (JAMstack), backend en Render (Node.js), con comunicación vía REST API. Implementé CORS para permitir cross-origin requests desde el dominio de producción. Para el backend, configuré variables de entorno para el puerto dinámico que Render asigna, y agregué health checks para monitoring. Todo integrado con CI/CD: cada push a GitHub dispara un redeploy automático en Render."

---

## 📞 COMANDOS RÁPIDOS

```powershell
# Subir cambios al backend
cd c:\Users\Valeria\Documents\Mallku
git add .
git commit -m "Update backend"
git push

# Render redesplegará automáticamente en ~2 minutos

# Ver logs en tiempo real
# Ve a: https://dashboard.render.com → tu servicio → Logs
```

---

🌿 **¡Tu sistema está listo para producción!**

**URLs finales:**
- 🛒 Tienda: https://tienda-mallku.netlify.app
- 🚀 Backend: https://mallku-backend-XXXX.onrender.com
- 📊 Dashboard: (desplegar en Vercel después)
