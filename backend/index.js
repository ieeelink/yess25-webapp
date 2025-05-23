import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';
import { randomUUID } from 'crypto';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clientId = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = process.env.CLIENT_VERSION;
const env = Env.SANDBOX;
const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../dist')));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uri = process.env.MONGODB_URI;
const dbclient = new MongoClient(uri);

async function insertPaymentRequest(reqBody) {
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    
    const result = await collection.insertOne({
      ...reqBody,
      timestamp: new Date()
    });
    
    console.log(`Payment request inserted with _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error inserting payment request:", error);
  } finally {
    await dbclient.close();
  }
}

// Basic route
app.post('/api/payment', (req, res) => {
  console.log(req.body)
  insertPaymentRequest(req.body);
  res.json({ message: 'Payment request received' });
  // const orderId = randomUUID();
  // const payment = StandardCheckoutPayRequest.builder().amount(500.00).merchantOrderId(orderId).redirectUrl("https://www.google.com").build();
  // client.pay(payment).then((response) => {
  //   const paymentUrl = response.paymentUrl;
  //   res.json({ response });
  // }).catch((error) => {
  //   res.status(500).json({ error: error.message });
  // });
});

// Catch-all route for handling SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
