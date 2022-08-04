const express = require('express')
const cors = require('cors')
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const db = require('./db')

const app = express()
const apiPort = 4200

// Must first load the models
require('./farmer/farmer.model');
require('./customer/customer.model')
require('./admin/admin.model')

// Pass the global passport object into the configuration function
require('./lib/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Serve static files from upload folder
app.use("/uploads", express.static("../data/uploads"));

app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
      origin: ["http://localhost:3000", "https://checkout.stripe.com"],
    })
  );
app.use(express.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/farmer', require('./farmer/farmer.router'))
app.use('/api/customer', require('./customer/customer.router'))
app.use('/api/admin', require('./admin/admin.router'))
app.use('/api/product', require('./product/product.router'))
app.use('/api/upload', require('./upload/upload.router'))
app.use('/api/order', require('./order/order.router'))



app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))