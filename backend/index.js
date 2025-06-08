import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import razorpay from 'razorpay';
import { randomUUID } from 'crypto';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../dist')));

var pgclient = new razorpay({
  key_id: process.env.CLIENT_KEY,
  key_secret: process.env.CLIENT_SECRET
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uri = process.env.MONGODB_URI;
const dbclient = new MongoClient(uri);

async function insertPaymentRequest(reqBody, yessTicketId) {
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    
    const result = await collection.insertOne({
      ...reqBody,
      timestamp: new Date(),
      yessTicketId: yessTicketId,
    });
    
    console.log(`Payment request inserted with _id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error("Error inserting payment request:", error);
  } finally {
    await dbclient.close();
  }
}

async function insertOrderDetails(emailID, orderId, status, amount_paid) {
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    
    const result = await collection.updateOne(
      { email: emailID },
      { $set: { 
        orderId: orderId,
        status: status,
        amount_paid: amount_paid
       } }
    );
    result(result.modifiedCount);
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

app.post('/api/retrypayment', async (req,res)=>{
  try {
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    const result = await collection.find({ email: req.body.email }).toArray();

    const merchantOrderId = randomUUID();
    const email = req.body.email;
    const name = result.map(doc => doc.fullName);
    await collection.updateOne(
      { email: email },
      { $set: { merchantOrderId: merchantOrderId } }
    );
    const payment = StandardCheckoutPayRequest.builder()
      .amount(500.00)
      .merchantOrderId(merchantOrderId)
      .redirectUrl(`https://80eb-103-203-72-213.ngrok-free.app/paymentStatus`)
      .build();

    const response = await client.pay(payment);
    await collection.updateOne(
      { email: email },
      { $set: { orderId: response.orderId } }
    );
    response.merchantOrderId = merchantOrderId;
    response.email = email;
    response.name = name;
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await dbclient.close();
  }
});
async function createNewOrder(reqBody, amount, yessTicketId) {
  try {
    const order = await pgclient.orders.create({
      "amount": amount*100,
      "currency": "INR",
      "partial_payment": false,
      "receipt": yessTicketId,
      "notes":{
        "email": reqBody.email,
        "name":reqBody.fullName
      }
    });
    return order
  } catch (error) {
    console.error("Error creating order:", error);
    return(error);
  }
}
// Payment route
app.post('/api/payment', async (req, res) => {
  console.log(req.body)
  const yessTicketId = randomUUID();
  let ticketrate;
  try {
    // Check for duplicate email
    await dbclient.connect();
    const database = dbclient.db("yess25");
    const collection = database.collection("tickets");
    const existingUser = await collection.findOne({ email: req.body.email });
    if(req.body.isIEEEMember === 'yes'){
      ticketrate = 500;
    }else if(req.body.isIEEEMember ==='no'){
      ticketrate = 1000;
    }
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'This email address has already been registered for the event'
      });
    }

    const dbOrderInsert = await insertPaymentRequest(req.body, yessTicketId);
    if (!dbOrderInsert) {
      return res.status(500).json({ error: 'Failed to insert payment request' });
    }
    const order = await createNewOrder(req.body, ticketrate, yessTicketId);
    if (order instanceof Error) {
      return res.status(500).json({ error: order.message });
    }
    const dbStatusInsert = await insertOrderDetails(req.body.email, order.id, order.status, order.amount_paid);
    // Only proceed with registration if email is not found
    // const dbobid = await insertPaymentRequest(req.body, merchantOrderId);
    // const payment = StandardCheckoutPayRequest.builder()
    //   .amount(500.00)
    //   .merchantOrderId(merchantOrderId)
    //   .redirectUrl(`https://80eb-103-203-72-213.ngrok-free.app/paymentStatus`)
    //   .build();

    // const response = await client.pay(payment);
    // await insertOrderId(dbobid, response.orderId);
    // response.merchantOrderId = merchantOrderId;
    // response.email = req.body.email;
    res.status(200).json( order );
  } catch (error) {
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
