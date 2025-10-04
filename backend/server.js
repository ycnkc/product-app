const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

const getGoldPrice = async () => {
    const url = 'https://www.goldapi.io/api/XAU/USD';
    const headers = {'x-access-token': process.env.GOLD_API_KEY };
    try {
        const response = await axios.get(url, { headers });

        if (response.data.price_gram_24k) {
            return response.data.price_gram_24k;
        } else {
            return response.data.price / 31.1;
        }

    } catch (err) {
        console.error('Could not fetch gold price, using constant value', err);
        return 60;
    }
};

app.get('/api/products', async(req, res) => {
    try {
    const goldPrice = await getGoldPrice();

    let productsWithPrice = products.map(product => {
        const price = (product.popularityScore + 1) * product.weight * goldPrice;
        return { ...product, price: price.toFixed(2) };
    });

    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;

    if (minPrice) {
        productsWithPrice = productsWithPrice.filter(
            p => p.price >= Number(minPrice)
        );
    }

    if (maxPrice) {
        productsWithPrice = productsWithPrice.filter(
            p => p.price <= Number(maxPrice)
        );
    }

    if (minPopularity) {
        productsWithPrice = productsWithPrice.filter(
            p => p.popularityScore * 5 >= Number(minPopularity)
        );
    }

    if (maxPopularity) {
        productsWithPrice = productsWithPrice.filter(
            p => (p.popularityScore) * 5 <= Number(maxPopularity)
        );
    }

    res.json(productsWithPrice);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server working at ${process.env.PORT || 4000}`);
});