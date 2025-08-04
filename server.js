const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const authRoutes = require('./Route/auth');


dotenv.config();

const app = express();


app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true

    }
));
app.use(helmet());
app.use(compression());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use('/api/',limiter);


app.use('/api', authRoutes);


mongoose.connect(process.env.MONGODB_URI||'mongodb+srv://tonnymareba217:l4Puo2fOIQwRMyS9@cluster12.cbmehvu.mongodb.net/auth?retryWrites=true&w=majority&appName=Cluster12')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});