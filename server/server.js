import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'

// Initialize Express

const app = express()

//Connect database

await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes

app.get('/',(red,res)=>res.send("API WORKING"))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("Sentry error!");
  });

app.post('/webhooks',clerkWebhooks)

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `);
})