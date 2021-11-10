const { MongoClient } = require('mongodb');

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 4000

// MIDDLEWARE
app.use(cors());
// access to send of body data
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmhhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function ledNightLight() {
    try {
        await client.connect();

        const database = client.db('LedNightLight');
        const bannerCollection = database.collection("banner");
        const productCollection = database.collection("products");

        // GET BANNER API
        app.get('/banner', async (req, res) => {
            const cursor = bannerCollection.find({});
            const bannerArray = await cursor.toArray();
            res.json(bannerArray);
        });

        // GET PRODUCTS API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const bannerArray = await cursor.toArray();
            res.json(bannerArray);
        });
    }
    finally {
        // await client.close();
    }
}

ledNightLight().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello LnL!')
});

app.listen(port, () => {
    console.log('LnL server running on', port)
});