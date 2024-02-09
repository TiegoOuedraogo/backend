const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const connectDB = require('./config/db');

require('dotenv').config();
require('./config/passport')(passport);

// Importing routes
const categoriesRoutes = require('./routes/categoriesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productsRoutes = require('./routes/productsRoutes');
const promotionsRoutes = require('./routes/promotionsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const privateRoutes = require('./routes/privateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();

const PORT = process.env.PORT || 5000;
// Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));

// Connect Database
connectDB();


// Define your routes here
app.use('/api/private', privateRoutes);

app.use('/api/categories', categoriesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userProfileRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Protected route
app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Protected content');
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

