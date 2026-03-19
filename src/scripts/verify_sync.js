async function testRiderSync() {
  const orderId = 'test-sync-' + Date.now();
  
  console.log('1. Creating test order in Whupi...');
  try {
    const postRes = await fetch('http://localhost:10000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: orderId,
        merchant_id: 'm-lodejacinto',
        customer_name: 'Test Rider Sync Fetch',
        customer_phone: '123456789',
        customer_address: 'Calle Falsa 123',
        total_amount: 1500,
        items: []
      })
    });
    console.log('Order created status:', postRes.status);

    console.log('2. Accepting order via API...');
    const patchRes = await fetch(`http://localhost:10000/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' })
    });
    const patchData = await patchRes.json();
    console.log('API Response:', patchData);

    console.log('Verification: Check the Pediclub DB manually or via script.');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

testRiderSync();
