import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './db';
import userRoute from './routers/userRoute';
import clientRoute from './routers/clientRoute';
import orderRoute from './routers/orderRoute';
import productRoute from './routers/productRoute';
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec from './swagger'; 
import dashboardRoute from './routers/dashboardRoute';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: ['http://localhost:8000'],  
  credentials: true  // Allows cookies and other credentials
}));
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//DB
connectDB();

// Use Routes
app.use('/api/users', userRoute);
app.use('/api/clients', clientRoute);
app.use('/api/orders', orderRoute);
app.use('/api/products', productRoute);
app.use('/api/stock', dashboardRoute);
app.use('api/revenue', dashboardRoute);

// Root route
app.get('/', (req, res) => {
  res.send('Hey server, lets rock and roll!');
});

// server port
const PORT = process.env.PORT || 8000; 

app.listen(PORT, () => {
  console.log(`skinny server lives here: http://localhost:${PORT}`);
  console.log(`Swagger Docs available at: http://localhost:${PORT}/api-docs`);
});
