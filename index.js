const { MongoClient } = require('mongodb');

const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
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
        const myOrderCollection = database.collection("myorders");

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

        // SINGLE PRODUCT API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await productCollection.findOne(query);
            res.send(singleProduct);
        });

        // POST API FOR ORDER PLACE
        app.post('/myorders', async (req, res) => {
            const newUser = req.body;
            const result = await myOrderCollection.insertOne(newUser);
            res.json(result)
        });

        // USER EMAIL WISE FILTER
        app.get('/myorders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = myOrderCollection.find(query)
            const order = await cursor.toArray()
            res.json(order);
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