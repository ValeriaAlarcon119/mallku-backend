# 📧 Integración con Netlify Forms - Datos Reales

## 🎯 Estado Actual

Tu tienda en **https://tienda-mallku.netlify.app** ya está capturando pedidos reales a través de:

1. ✅ **Netlify Forms** → Emails automáticos a `mallkusentiresandinos@gmail.com`
2. ✅ **Backend Local** → Dashboard Analytics (cuando el servidor está corriendo)

---

## 🔄 Cómo Funciona Ahora

### Flujo de Datos de un Pedido Real:

```
Cliente completa compra en tienda
         ↓
    [2 acciones simultáneas]
         ↓
         ├─→ 📧 Netlify Forms → Email
         │
         └─→ 📊 Backend API → Dashboard
```

### Código Implementado (index.html línea 1393):

```javascript
fetch('http://localhost:3000/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        customerId: `cust_${Date.now()}`,
        customerName: name,
        amount: total,
        products: cart.map(item => item.name),
        channel: 'online',
        email: email,
        phone: phone,
        paymentMethod: selectedPayment,
        deliveryType: isPickup ? 'pickup' : 'delivery'
    })
})
```

---

## 🚀 Para Producción (Desplegar Backend)

### Opción 1: Render (Recomendada - GRATIS)

1. **Crear cuenta en Render:** https://render.com
2. **Crear nuevo Web Service**
3. **Conectar tu repositorio GitHub**
4. **Configuración:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
   - **Environment:** Node
5. **Variables de entorno:**
   ```
   PORT=3000
   NODE_ENV=production
   ```
6. **Deploy!**

Render te dará una URL como: `https://mallku-backend-abc.onrender.com`

### Opción 2: Railway

```bash
npm install -g railway
railway login
railway init
railway up
```

### Opción 3: Fly.io

```bash
npm install -g flyctl
fly launch
fly deploy
```

---

## 🔧 Actualización Post-Deploy

Después de desplegar el backend, actualiza estas 2 líneas en `index.html`:

### 1. Línea 1393 (Checkout)
```javascript
// ANTES (localhost):
fetch('http://localhost:3000/api/sales', {

// DESPUÉS (producción):
fetch('https://tu-backend.onrender.com/api/sales', {
```

### 2. Línea 1515 (Analytics Base URL)
```javascript
// ANTES:
const API_BASE = 'http://localhost:3000/api';

// DESPUÉS:
const API_BASE = 'https://tu-backend.onrender.com/api';
```

### 3. Backend CORS (server.js)

Actualiza CORS para permitir tu dominio:

```javascript
app.use(cors({
  origin: ['https://tienda-mallku.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## 📊 Acceder a Datos de Netlify Forms (API)

Netlify te permite acceder programáticamente a los submissions:

### Configurar Access Token:

1. Ve a **Netlify → Site Settings → Build & Deploy → Build Hooks**
2. Crea un nuevo **Personal Access Token**
3. Guárdalo como variable de entorno: `NETLIFY_ACCESS_TOKEN`

### Endpoint para leer submissions:

```javascript
// En server.js (opcional - para importar pedidos históricos)
const fetch = require('node-fetch');

app.get('/api/import-netlify-orders', async (req, res) => {
  const response = await fetch(
    `https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`
      }
    }
  );
  
  const submissions = await response.json();
  
  // Procesar y guardar en tu base de datos
  submissions.forEach(sub => {
    salesData.push({
      id: sub.id,
      customerId: `cust_netlify_${sub.number}`,
      customerName: sub.data.name,
      amount: parseInt(sub.data.total),
      products: sub.data.details.split('\n').filter(Boolean),
      channel: 'online',
      timestamp: sub.created_at
    });
  });
  
  res.json({ imported: submissions.length });
});
```

---

## 🧪 Probar en Local

### Test 1: Verificar que el backend recibe pedidos

1. Abre la tienda: `http://localhost:3000` (o con `npx serve .`)
2. Agrega productos al carrito
3. Completa checkout
4. Verifica en la consola del backend:
   ```
   POST /api/sales 200
   ✅ Nueva venta registrada: $45000
   ```

### Test 2: Ver datos en Dashboard

1. Abre dashboard: `http://localhost:5173`
2. Debería mostrar:
   - Total de ingresos actualizado
   - Nuevo pedido en "Recent Activity"
   - Cliente en "Top Customers (LTV)"

---

## 📈 Próximos Pasos Sugeridos

### 1. Base de Datos Persistente

Actualmente los datos se pierden cuando reinicias el servidor. Opciones:

**MongoDB Atlas (GRATIS):**
```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const SaleSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  amount: Number,
  products: [String],
  timestamp: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', SaleSchema);
```

**PostgreSQL (Supabase GRATIS):**
```bash
npm install @supabase/supabase-js
```

### 2. Webhook de Netlify Forms

Configura un webhook para que Netlify envíe AUTOMÁTICAMENTE cada pedido a tu backend:

**En Netlify Dashboard:**
- Site Settings → Build & Deploy → Post Processing → Form Notifications
- Añadir notificación tipo "Outgoing webhook"
- URL: `https://tu-backend.onrender.com/api/webhook/netlify-order`

**En server.js:**
```javascript
app.post('/api/webhook/netlify-order', (req, res) => {
  const { data } = req.body;
  
  // Procesar pedido de Netlify automáticamente
  customerOrders.push({
    name: data.name,
    email: data.email,
    total: data.total,
    timestamp: new Date()
  });
  
  res.status(200).send('OK');
});
```

### 3. Autenticación para Dashboard

Protege el dashboard con login:

```bash
npm install jsonwebtoken bcrypt
```

```javascript
// Middleware de autenticación
app.use('/api/admin/*', authenticateToken);
```

---

## 🎓 Para Entrevistas

**Pregunta:** *"¿Cómo conectaste tu tienda e-commerce con analytics?"*

> "Implementé una arquitectura dual donde los pedidos se capturan tanto en Netlify Forms (para emails automáticos) como en un backend Node.js propio (para analytics en tiempo real). Cada checkout hace un POST simultáneo a ambos endpoints, asegurando redundancia de datos. El backend expone una REST API que consume un dashboard React con Framer Motion, mostrando métricas como conversion funnel, customer LTV, y predicciones IA. Todo con manejo de errores para que la tienda funcione incluso si el backend está offline."

---

## 🐛 Troubleshooting

### Problema: Dashboard no muestra datos reales

**Solución:**
1. Verifica que el backend esté corriendo: `http://localhost:3000/api/stats`
2. Abre consola del navegador en la tienda
3. Haz un pedido de prueba
4. Busca: `Analytics offline` → Significa que el backend no está accesible

### Problema: CORS error en producción

**Solución:**
```javascript
// server.js
app.use(cors({
  origin: 'https://tienda-mallku.netlify.app'
}));
```

### Problema: Los datos se borran al reiniciar

**Solución:**
- Implementa MongoDB/PostgreSQL (ver "Próximos Pasos")
- O usa `node-persist` para almacenamiento local:
  ```bash
  npm install node-persist
  ```

---

🌿 **Mallku** - Conectando tienda real con analytics inteligente
