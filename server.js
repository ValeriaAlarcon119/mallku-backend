const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://tienda-mallku.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

// ============================================
// 📊 IN-MEMORY DATABASE (Enhanced Real-time)
// ============================================
let salesData = [];
let cartActivity = [];
let customers = new Map();
let whatsappClicks = [];
let abandonedCarts = [];
let pageVisits = [];
let stockLevels = new Map();

// ============================================
// 🎯 AI CONSULTANT LOGIC
// ============================================
function getAIRecommendation() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Analizar patrones
    const recentSales = salesData.slice(-10);
    const topProduct = getTopProduct();
    const conversionRate = getConversionRate();

    // Reglas de IA
    if (conversionRate < 20) {
        return {
            type: 'urgente',
            message: `🔴 Tu conversión está en ${conversionRate}%. Activa un cupón "MALLKU10" para recuperar carritos abandonados.`,
            action: 'Crear cupón de descuento'
        };
    }

    if (dayOfWeek === 4 && hour >= 17 && hour <= 20) { // Jueves 5-8 PM
        return {
            type: 'oportunidad',
            message: '🟡 Los jueves por la tarde son tu pico de visitas. Publica en Instagram Stories AHORA.',
            action: 'Publicar en redes'
        };
    }

    if (topProduct && stockLevels.get(topProduct.name) < 5) {
        return {
            type: 'alerta',
            message: `🟠 ${topProduct.name} se está agotando (${stockLevels.get(topProduct.name)} unidades). Reabastece YA.`,
            action: 'Reabastecer inventario'
        };
    }

    if (abandonedCarts.length > 5) {
        return {
            type: 'recuperación',
            message: `💰 Tienes ${abandonedCarts.length} carritos abandonados. Envía mensaje por WhatsApp: "Hola! Vi que dejaste productos en el carrito. ¿Te ayudo?"`,
            action: 'Recuperar carritos'
        };
    }

    return {
        type: 'optimización',
        message: `✅ Todo va bien. ${topProduct ? topProduct.name : 'Tus productos'} están siendo populares. Considera crear bundles.`,
        action: 'Crear paquetes promocionales'
    };
}

function getTopProduct() {
    const productClicks = {};
    cartActivity.forEach(act => {
        productClicks[act.product] = (productClicks[act.product] || 0) + 1;
    });
    const sorted = Object.entries(productClicks).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { name: sorted[0][0], clicks: sorted[0][1] } : null;
}

function getConversionRate() {
    const totalVisits = pageVisits.length;
    const totalSales = salesData.length;
    return totalVisits > 0 ? ((totalSales / totalVisits) * 100).toFixed(1) : 0;
}

// ============================================
// 📡 ENHANCED API ENDPOINTS
// ============================================

// Health Check (para Render)
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        stats: {
            sales: salesData.length,
            customers: customers.size,
            visits: pageVisits.length
        }
    });
});

// 1️⃣ Dashboard Stats (Enhanced)
app.get('/api/stats', (req, res) => {
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const activeCustomers = customers.size;
    const monthlyOrders = salesData.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        const now = new Date();
        return saleDate.getMonth() === now.getMonth();
    }).length;

    const conversionRate = parseFloat(getConversionRate());

    // AI Prediction
    const recentSales = salesData.slice(-10);
    const avgRecent = recentSales.reduce((sum, s) => sum + s.amount, 0) / (recentSales.length || 1);
    const prediction = Math.round(avgRecent * 1.15);

    res.json({
        totalRevenue,
        activeCustomers,
        monthlyOrders,
        conversionRate,
        aiPrediction: prediction,
        currentMonth: avgRecent,
        // NEW METRICS
        totalVisits: pageVisits.length,
        whatsappClicks: whatsappClicks.length,
        abandonedCarts: abandonedCarts.length,
        funnelConversion: {
            visits: pageVisits.length,
            addedToCart: cartActivity.length,
            whatsappContact: whatsappClicks.length,
            purchases: salesData.length
        }
    });
});

// 2️⃣ AI Consultant (NEW)
app.get('/api/ai/recommendation', (req, res) => {
    res.json(getAIRecommendation());
});

// 3️⃣ Stock Monitor (NEW)
app.get('/api/stock', (req, res) => {
    const stock = Array.from(stockLevels.entries()).map(([product, quantity]) => ({
        product,
        quantity,
        status: quantity < 5 ? 'low' : quantity < 15 ? 'medium' : 'high'
    }));
    res.json(stock);
});

// 4️⃣ Conversion Funnel (NEW)
app.get('/api/funnel', (req, res) => {
    const funnel = [
        { stage: 'Visitas', count: pageVisits.length, rate: 100 },
        { stage: 'Agregaron al Carrito', count: cartActivity.length, rate: ((cartActivity.length / (pageVisits.length || 1)) * 100).toFixed(1) },
        { stage: 'Clic en WhatsApp', count: whatsappClicks.length, rate: ((whatsappClicks.length / (cartActivity.length || 1)) * 100).toFixed(1) },
        { stage: 'Compras', count: salesData.length, rate: ((salesData.length / (whatsappClicks.length || 1)) * 100).toFixed(1) }
    ];
    res.json(funnel);
});

// 5️⃣ Abandoned Carts (NEW)
app.get('/api/abandoned-carts', (req, res) => {
    res.json(abandonedCarts.slice(-10).reverse());
});

// Original endpoints
app.get('/api/sales/timeline', (req, res) => {
    const monthlyData = {};
    salesData.forEach(sale => {
        const date = new Date(sale.timestamp);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { online: 0, fisica: 0 };
        if (sale.channel === 'online') monthlyData[monthKey].online += sale.amount;
        else monthlyData[monthKey].fisica += sale.amount;
    });
    const timeline = Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));
    res.json(timeline);
});

app.get('/api/activity', (req, res) => {
    res.json(cartActivity.slice(-20).reverse());
});

app.get('/api/products/heatmap', (req, res) => {
    const productClicks = {};
    cartActivity.forEach(activity => {
        productClicks[activity.product] = (productClicks[activity.product] || 0) + 1;
    });
    const heatmap = Object.entries(productClicks)
        .map(([product, clicks]) => ({ product, clicks }))
        .sort((a, b) => b.clicks - a.clicks);
    res.json(heatmap);
});

app.get('/api/customers/ltv', (req, res) => {
    const customerLTV = Array.from(customers.values()).map(customer => {
        const customerSales = salesData.filter(s => s.customerId === customer.id);
        const totalSpent = customerSales.reduce((sum, s) => sum + s.amount, 0);
        return {
            name: customer.name,
            totalSpent,
            orders: customerSales.length,
            avgOrder: customerSales.length > 0 ? Math.round(totalSpent / customerSales.length) : 0
        };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
    res.json(customerLTV.slice(0, 10));
});

// ============================================
// 📥 ENHANCED POST ENDPOINTS
// ============================================

app.post('/api/sales', (req, res) => {
    const { customerId, customerName, amount, products, channel } = req.body;
    const sale = {
        id: Date.now().toString(),
        customerId,
        amount,
        products,
        channel: channel || 'online',
        timestamp: new Date().toISOString()
    };
    salesData.push(sale);
    if (!customers.has(customerId)) {
        customers.set(customerId, { id: customerId, name: customerName, firstPurchase: new Date().toISOString() });
    }
    res.json({ success: true, saleId: sale.id });
});

app.post('/api/activity', (req, res) => {
    const { product, action, timestamp } = req.body;
    const activity = {
        id: Date.now().toString(),
        product,
        action: action || 'added_to_cart',
        timestamp: timestamp || new Date().toISOString()
    };
    cartActivity.push(activity);
    if (cartActivity.length > 100) cartActivity = cartActivity.slice(-100);
    res.json({ success: true, activityId: activity.id });
});

// 6️⃣ Track Page Visit (NEW)
app.post('/api/visit', (req, res) => {
    const visit = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        page: req.body.page || 'home'
    };
    pageVisits.push(visit);
    if (pageVisits.length > 200) pageVisits = pageVisits.slice(-200);
    res.json({ success: true, visitId: visit.id });
});

// 7️⃣ Track WhatsApp Click (NEW)
app.post('/api/whatsapp-click', (req, res) => {
    const click = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: req.body.source || 'floating_button'
    };
    whatsappClicks.push(click);
    res.json({ success: true, clickId: click.id });
});

// 8️⃣ Track Abandoned Cart (NEW)
app.post('/api/abandoned-cart', (req, res) => {
    const { products, totalAmount, timestamp } = req.body;
    const abandoned = {
        id: Date.now().toString(),
        products,
        totalAmount,
        timestamp: timestamp || new Date().toISOString()
    };
    abandonedCarts.push(abandoned);
    res.json({ success: true, cartId: abandoned.id });
});

// 9️⃣ Update Stock (NEW)
app.post('/api/stock/update', (req, res) => {
    const { product, quantity } = req.body;
    stockLevels.set(product, quantity);
    res.json({ success: true, product, newQuantity: quantity });
});

// ============================================
// 🔄 SEED DATA (Enhanced)
// ============================================
function seedData() {
    const products = ['Aceite Cannabis', 'Hidrolato Lavanda', 'Aromática Mix', 'Ungüento Recuperador', 'Aceite Tomillo'];
    const names = ['Ana Martínez', 'Carlos López', 'María García', 'Juan Pérez', 'Sofía Rodríguez'];

    // Initialize stock
    products.forEach(p => stockLevels.set(p, Math.floor(Math.random() * 20) + 5));

    // Generate historical data
    for (let i = 0; i < 100; i++) {
        pageVisits.push({ id: `visit_${i}`, timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), page: 'home' });
    }

    for (let i = 0; i < 60; i++) {
        cartActivity.push({
            id: `cart_${i}`,
            product: products[Math.floor(Math.random() * products.length)],
            action: 'added_to_cart',
            timestamp: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
        });
    }

    for (let i = 0; i < 40; i++) {
        whatsappClicks.push({ id: `wa_${i}`, timestamp: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(), source: 'floating_button' });
    }

    for (let i = 0; i < 50; i++) {
        const customerId = `cust_${Math.floor(Math.random() * 5)}`;
        const customerName = names[Math.floor(Math.random() * names.length)];
        const timestamp = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
        const sale = {
            id: `sale_${i}`,
            customerId,
            amount: Math.floor(Math.random() * 50000) + 10000,
            products: [products[Math.floor(Math.random() * products.length)]],
            channel: Math.random() > 0.5 ? 'online' : 'fisica',
            timestamp: timestamp.toISOString()
        };
        salesData.push(sale);
        if (!customers.has(customerId)) {
            customers.set(customerId, { id: customerId, name: customerName, firstPurchase: timestamp.toISOString() });
        }
    }

    for (let i = 0; i < 8; i++) {
        abandonedCarts.push({
            id: `abandoned_${i}`,
            products: [products[Math.floor(Math.random() * products.length)]],
            totalAmount: Math.floor(Math.random() * 40000) + 15000,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }

    console.log(`✅ Seeded complete analytics database`);
    console.log(`   📊 ${salesData.length} sales`);
    console.log(`   👥 ${customers.size} customers`);
    console.log(`   🛒 ${cartActivity.length} cart activities`);
    console.log(`   👁️ ${pageVisits.length} page visits`);
    console.log(`   📱 ${whatsappClicks.length} WhatsApp clicks`);
    console.log(`   🚫 ${abandonedCarts.length} abandoned carts`);
}

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`\n🌿 Mallku Growth Analytics API running on http://localhost:${PORT}`);
    console.log(`\n📊 Enhanced Endpoints:`);
    console.log(`   GET  /api/stats                  - Dashboard metrics + funnel`);
    console.log(`   GET  /api/ai/recommendation      - AI sales consultant`);
    console.log(`   GET  /api/stock                  - Stock levels & alerts`);
    console.log(`   GET  /api/funnel                 - Conversion funnel`);
    console.log(`   GET  /api/abandoned-carts        - Recovery opportunities`);
    console.log(`   POST /api/visit                  - Track page visit`);
    console.log(`   POST /api/whatsapp-click         - Track WhatsApp engagement`);
    console.log(`   POST /api/abandoned-cart         - Log abandoned cart`);
    console.log(`   POST /api/stock/update           - Update inventory\n`);
    seedData();
});
