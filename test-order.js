// Test script para simular un pedido real desde Netlify
const API_BASE = 'http://localhost:3000/api';

async function testRealOrder() {
    const mockOrder = {
        customerId: `cust_${Date.now()}`,
        customerName: 'María García (TEST)',
        amount: 85000,
        products: ['Aceite Cannabis (CBD)', 'Hidrolato Lavanda'],
        channel: 'online',
        email: 'test@ejemplo.com',
        phone: '3001234567',
        paymentMethod: 'Nequi',
        deliveryType: 'delivery'
    };

    console.log('🧪 Enviando pedido de prueba al backend...\n');
    console.log('Datos:', JSON.stringify(mockOrder, null, 2));

    try {
        const response = await fetch(`${API_BASE}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOrder)
        });

        const data = await response.json();
        console.log('\n✅ Respuesta del servidor:', data);

        // Verificar stats actualizadas
        const statsResponse = await fetch(`${API_BASE}/stats`);
        const stats = await statsResponse.json();

        console.log('\n📊 Stats actualizadas:');
        console.log(`   💰 Ingresos totales: $${stats.totalRevenue.toLocaleString()}`);
        console.log(`   👥 Clientes activos: ${stats.activeCustomers}`);
        console.log(`   📦 Pedidos del mes: ${stats.monthlyOrders}`);
        console.log(`   📈 Conversión: ${stats.conversionRate}%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Asegúrate de que el backend esté corriendo:');
        console.log('   cd Mallku');
        console.log('   npm run server');
    }
}

testRealOrder();
