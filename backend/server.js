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
        return response.data.price;
    } catch (err) {
        console.error('Could not fetch gold price, using constant value', err);
        return 60;
    }
};

app.get('/api/products', async(req, res) => {
    try {
    const goldPrice = await getGoldPrice();
    const goldPricePerGram = goldPrice / 31.1;

    let productsWithPrice = products.map(product => {
        const price = (product.popularityScore + 1) * product.weight * goldPricePerGram;
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
            p => p.popularityScore >= Number(minPopularity)
        );
    }

    if (maxPopularity) {
        productsWithPrice = productsWithPrice.filter(
            p => (p.popularityScore) <= Number(maxPopularity)
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