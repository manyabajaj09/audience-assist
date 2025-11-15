require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(process.env.MONGO_URI || process.env.MONGODB_URI);

// Import routes
const messagesRoute = require('./routes/messages');
const ticketsRoute = require('./routes/tickets');
const usersRoute = require('./routes/users');
const analyticsRoute = require('./routes/analytics');

// Register routes
app.use('/api/messages', messagesRoute);
app.use('/api/tickets', ticketsRoute);
app.use('/api/users', usersRoute);
app.use('/api/analytics', analyticsRoute);

app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Audience Query Management API',
        endpoints: {
            messages: '/api/messages',
            tickets: '/api/tickets',
            users: '/api/users',
            analytics: '/api/analytics'
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));