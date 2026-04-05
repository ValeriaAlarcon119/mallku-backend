const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://tienda-mallku.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

// 1. Servir archivos estáticos del root (Tienda Legacy - index.html)
app.use(express.static('.'));

// 2. Servir el Dashboard (React) compilado en la ruta /dashboard
// Asumimos que el build está en mallku-react/dist
app.use('/dashboard', express.static(path.join(__dirname, 'mallku-react/dist')));

// 3. Fallback para SPA (Single Page Application) del Dashboard
app.get(/\/dashboard(\/.*)?/, (req, res) => {
    res.sendFile(path.join(__dirname, 'mallku-react/dist/index.html'));
});

// ============================================
// 📊 PERSISTENCE LAYER
// ============================================
let salesData = [];
let cartActivity = [];
let customers = new Map();
let whatsappClicks = [];
let abandonedCarts = [];
let pageVisits = [];
let stockLevels = new Map();

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const data = JSON.parse(raw);
            salesData = data.salesData || [];
            cartActivity = data.cartActivity || [];
            whatsappClicks = data.whatsappClicks || [];
            abandonedCarts = data.abandonedCarts || [];
            pageVisits = data.pageVisits || [];
            
            if (data.customers) {
                customers = new Map(Object.entries(data.customers));
            }
            if (data.stockLevels) {
                stockLevels = new Map(Object.entries(data.stockLevels));
            }
            console.log(`✅ Data loaded from ${DATA_FILE}`);
            return true;
        } catch (e) {
            console.error("❌ Error loading data:", e);
        }
    }
    return false;
}

function saveData() {
    try {
        const data = {
            salesData,
            cartActivity,
            customers: Object.fromEntries(customers),
            whatsappClicks,
            abandonedCarts,
            pageVisits,
            stockLevels: Object.fromEntries(stockLevels)
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("❌ Error saving data:", e);
    }
}

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

app.get('/api/customers/lookup/:phone', (req, res) => {
    const phone = req.params.phone;
    // Buscamos en el Map de clientes
    const customer = Array.from(customers.values()).find(c => c.phone === phone);
    if (customer) {
        res.json({ found: true, customer });
    } else {
        res.json({ found: false });
    }
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
        customerId: customerId || `cust_${Date.now()}`,
        amount,
        products,
        channel: channel || 'online',
        timestamp: new Date().toISOString()
    };
    salesData.push(sale);
    if (!customers.has(sale.customerId)) {
        customers.set(sale.customerId, { id: sale.customerId, name: customerName, firstPurchase: new Date().toISOString() });
    }
    saveData();
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
    saveData();
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
    saveData();
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
    saveData();
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
    saveData();
    res.json({ success: true, cartId: abandoned.id });
});

// 9️⃣ Update Stock (NEW)
app.post('/api/stock/update', (req, res) => {
    const { product, quantity } = req.body;
    stockLevels.set(product, quantity);
    res.json({ success: true, product, newQuantity: quantity });
});

// 🔟 Customer Details with Emails (NEW - for modal)
app.get('/api/customers/details', (req, res) => {
    const customerDetails = Array.from(customers.values()).map(customer => {
        const customerSales = salesData.filter(s => s.customerId === customer.id);
        const totalSpent = customerSales.reduce((sum, s) => sum + s.amount, 0);
        const lastPurchase = customerSales.length > 0
            ? customerSales.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
            : customer.firstPurchase;
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            totalSpent,
            orders: customerSales.length,
            lastPurchase,
            firstPurchase: customer.firstPurchase,
            favoriteProduct: getMostBoughtProduct(customerSales)
        };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
    res.json(customerDetails);
});

function getMostBoughtProduct(sales) {
    const counts = {};
    sales.forEach(s => {
        s.products.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : 'N/A';
}

// 1️⃣1️⃣ Monthly Orders Detail (NEW - for modal)
app.get('/api/orders/monthly', (req, res) => {
    const now = new Date();
    const monthlyOrders = salesData.filter(sale => {
        const saleDate = new Date(sale.timestamp);
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }).map(sale => {
        const customer = customers.get(sale.customerId);
        return {
            id: sale.id,
            customerName: customer ? customer.name : 'Cliente Anónimo',
            customerEmail: customer ? customer.email : 'N/A',
            amount: sale.amount,
            products: sale.products,
            channel: sale.channel,
            timestamp: sale.timestamp
        };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalMonth = monthlyOrders.reduce((sum, o) => sum + o.amount, 0);
    res.json({ orders: monthlyOrders, totalMonth, count: monthlyOrders.length });
});

// 1️⃣2️⃣ Sales Detail (NEW - for modal)
app.get('/api/sales/details', (req, res) => {
    const salesByCustomer = {};
    salesData.forEach(sale => {
        const customer = customers.get(sale.customerId);
        const name = customer ? customer.name : 'Anónimo';
        if (!salesByCustomer[name]) {
            salesByCustomer[name] = {
                name,
                email: customer ? customer.email : 'N/A',
                total: 0,
                orders: 0,
                products: []
            };
        }
        salesByCustomer[name].total += sale.amount;
        salesByCustomer[name].orders += 1;
        sale.products.forEach(p => {
            if (!salesByCustomer[name].products.includes(p)) salesByCustomer[name].products.push(p);
        });
    });

    const summary = Object.values(salesByCustomer).sort((a, b) => b.total - a.total);
    const grandTotal = salesData.reduce((sum, s) => sum + s.amount, 0);
    res.json({ summary, grandTotal, totalOrders: salesData.length });
});

// ============================================
// 🔄 SEED DATA (Enhanced)
// ============================================
function seedData() {
    const products = [
        'Aceite Esencial Cannabis (CBD)',
        'Aceite Esencial Cannabis Fullspectrum (CBD+THC)',
        'Aceite Esencial Tomillo',
        'Aceite Esencial Orégano',
        'Aceite Esencial Caléndula',
        'Aceite Esencial Manzanilla',
        'Hidrolato Lavanda',
        'Hidrolato Cítrico',
        'Hidrolato Romero',
        'Tintura a Base de Plantas',
        'Ungüento Recuperador Muscular a Base de Plantas',
        'Aromática Manzanilla',
        'Aromática Stevia',
        'Aromática Caléndula',
        'Aromática Cannabis',
        'Aromática Mix',
        'Aromática Frasco Manzanilla',
        'Aromática Frasco Caléndula',
        'Aromática Frasco Stevia',
        'Aromática Frasco Cannabis',
        'Aromática Mix Frasco'
    ];

    const customerData = [
        { id: 'cust_0', name: 'Ana Martínez', email: 'ana.martinez@gmail.com', phone: '+57 312 456 7890' },
        { id: 'cust_1', name: 'Carlos López', email: 'carlos.lopez@hotmail.com', phone: '+57 315 234 5678' },
        { id: 'cust_2', name: 'María García', email: 'maria.garcia@outlook.com', phone: '+57 318 567 8901' },
        { id: 'cust_3', name: 'Juan Pérez', email: 'juan.perez@yahoo.com', phone: '+57 320 890 1234' },
        { id: 'cust_4', name: 'Sofía Rodríguez', email: 'sofia.rodriguez@gmail.com', phone: '+57 311 345 6789' },
        { id: 'cust_5', name: 'Camila Torres', email: 'camila.torres@gmail.com', phone: '+57 314 678 9012' },
        { id: 'cust_6', name: 'Andrés Morales', email: 'andres.morales@outlook.com', phone: '+57 316 012 3456' },
        { id: 'cust_7', name: 'Laura Jiménez', email: 'laura.jimenez@hotmail.com', phone: '+57 319 234 5678' },
        { id: 'cust_8', name: 'Diego Ramírez', email: 'diego.ramirez@gmail.com', phone: '+57 313 456 7890' },
        { id: 'cust_9', name: 'Valentina Ospina', email: 'valentina.ospina@yahoo.com', phone: '+57 317 890 1234' }
    ];

    // Register all customers
    customerData.forEach(c => {
        customers.set(c.id, { ...c, firstPurchase: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() });
    });

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

    // Generate sales - ensure some are this month
    for (let i = 0; i < 50; i++) {
        const custIdx = Math.floor(Math.random() * customerData.length);
        const cust = customerData[custIdx];
        // Make ~20% of sales this month
        const isThisMonth = i < 12;
        const timestamp = isThisMonth
            ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
        const sale = {
            id: `sale_${i}`,
            customerId: cust.id,
            amount: Math.floor(Math.random() * 50000) + 10000,
            products: [products[Math.floor(Math.random() * products.length)]],
            channel: Math.random() > 0.5 ? 'online' : 'fisica',
            timestamp: timestamp.toISOString()
        };
        salesData.push(sale);
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
    
    const hasData = loadData();
    if (!hasData) {
        console.log("🌱 No existing data found. Seeding initial data...");
        seedData();
        saveData();
    }
});
