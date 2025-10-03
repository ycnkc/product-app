const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

const getGoldPrice = async () => {
    const url = 'https://www.goldapi.io/api/XAU/USD';
    const headers = {'x-access-token': process.env.GOLD_API_KEY };
    try {
        const response = await axios.get(url, { headers });
        return response.data.price;
    } catch (err) {
        console.error('Could not fetch gold price, using constant value', err);
        return 60;
    }
};

app.get('/api/products', async(req, res) => {
    const goldPrice = await getGoldPrice();
    const goldPricePerGram = goldPrice / 31.1;

    const productsWithPrice = products.map(product => {
        const price = (product.popularityScore + 1) * product.weight * goldPricePerGram;
        return { ...product, price: price.toFixed(2) };
    });

    res.json(productsWithPrice);
});

app.listen(PORT, () => {
    console.log(`Server working at ${PORT}`);
});