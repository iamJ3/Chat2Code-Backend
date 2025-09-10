// Test script to verify database connection error handling
import connect, { isDatabaseConnected, getConnectionStatus } from './db/db.js';

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  // Test connection
  const result = await connect();
  console.log('Connection result:', result);
  
  // Test status check
  const status = getConnectionStatus();
  console.log('Connection status:', status);
  
  // Test isConnected function
  const connected = isDatabaseConnected();
  console.log('Is connected:', connected);
  
  if (result.success) {
    console.log('✅ Database connection test passed');
  } else {
    console.log('❌ Database connection test failed - this is expected if DB credentials are wrong');
    console.log('Error message:', result.message);
  }
}

testDatabaseConnection().catch(console.error);
