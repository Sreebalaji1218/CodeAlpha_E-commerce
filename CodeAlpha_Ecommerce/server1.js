const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ecommerceDB')
.then(() => console.log("Ecommerce DB Connected!"))
.catch(err => console.log(err));

const productSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number
});

const cartSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    productPrice: Number
});

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

app.get('/get-products', async (req, res) => {
    let allProducts = await Product.find();
    if(allProducts.length === 0) {
        await new Product({ productName: "Engineering Physics Book", productPrice: 450 }).save();
        await new Product({ productName: "Scientific Calculator", productPrice: 1200 }).save();
        allProducts = await Product.find();
    }
    res.json(allProducts);
});

app.post('/add-to-cart', async (req, res) => {
    let item = await Product.findById(req.body.productId);
    let cartItem = new Cart({
        productId: item._id,
        productName: item.productName,
        productPrice: item.productPrice
    });
    await cartItem.save();
    res.send("Item added successfully!");
});

app.get('/get-cart', async (req, res) => {
    let items = await Cart.find();
    res.json(items);
});

app.post('/checkout', async (req, res) => {
    await Cart.deleteMany({});
    res.send("Order processed successfully! Thank you for buying.");
});

app.listen(5002, () => console.log("Task 1 Server running on port 5002"));