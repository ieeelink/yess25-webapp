import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';
import { randomUUID } from 'crypto';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import path from 'path';
import { error } from 'console';

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
  origin: 'https://4982-45-115-89-156.ngrok-free.app', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uri = process.env.MONGODB_URI;
const dbclient = new MongoClient(uri);

async function insertPaymentRequest(reqBody, merchantOrderId) {
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    
    const result = await collection.insertOne({
      ...reqBody,
      timestamp: new Date(),
      merchantOrderId: merchantOrderId,
    });
    
    console.log(`Payment request inserted with _id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error("Error inserting payment request:", error);
  } finally {
    await dbclient.close();
  }
}

async function insertOrderId(dbobid, orderId) {
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    
    const result = await collection.updateOne(
      { _id: dbobid },
      { $set: { orderId: orderId } }
    );
    
    console.log(`Document updated: ${result.modifiedCount} document(s) modified`);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  } finally {
    await dbclient.close();
  }
}
app.post('/api/paymentstatus', async (req,res)=>{
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    const result = await collection.find({ email: req.body.email }).toArray();

    const merchantOrderId = result.map(doc => doc.merchantOrderId);
    const email = req.body.email;

    const name = result.map(doc => doc.fullName);
    const response = await client.getOrderStatus(merchantOrderId);
    const paymentData = {
      fullName: name[0],
      email: email,
      status: response.paymentDetails[0].state
    };
    await collection.updateOne(
      { email: email },
      { $set: { status: response.paymentDetails[0].state } }
    );

    console.log(paymentData);
    console.log(response.paymentDetails);
    res.json(paymentData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await dbclient.close();
  }
});

// Payment route
app.post('/api/payment', async (req, res) => {
  console.log(req.body)
  const merchantOrderId = randomUUID();
  try {
    const dbobid = await insertPaymentRequest(req.body, merchantOrderId);
    const payment = StandardCheckoutPayRequest.builder()
      .amount(500.00)
      .merchantOrderId(merchantOrderId)
      .redirectUrl(`https://4982-45-115-89-156.ngrok-free.app/paymentStatus`)
      .build();

    const response = await client.pay(payment);
    await insertOrderId(dbobid, response.orderId);
    response.merchantOrderId = merchantOrderId;
    response.email = req.body.email;
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkduplicateemail', async (req, res) => {
  console.log(req.body)
  try {
    const dbclient = await connectToDatabase();
    const collection = dbclient.db("paymentdb").collection("payments");
    const result = await collection.find({ email: req.body.email }).toArray();
    res.json({ exists: result.length > 0 });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await dbclient.close();
  }
});

// Catch-all route for handling SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
