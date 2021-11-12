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
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection('users')

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

        // ADD API FOR PRODUCT
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result);
        });

        // USER EMAIL WISE FILTER
        /* app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query)
            const order = await cursor.toArray()
            res.json(order);
        });*/

        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection?.find({});
            const orderArray = await cursor.toArray();
            res.json(orderArray);
        });

        // GET REVIEW API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection?.find({});
            const reviewArray = await cursor.toArray();
            res.json(reviewArray);
        });

        // POST API FOR ORDER PLACE
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result)
        });

        // POST API FOR REVIEW PLACE
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.json(result)
        });

        // ORDER SINGLE API
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const findStatus = await orderCollection.findOne(query);
            res.send(findStatus);
        });

        // UPDATE PRODUCT STATUS
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                    title: updatedStatus.title
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc)
            res.send(result)
        });

        // ORDERED PRODUCT REMOVE
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        // SINGLE PRODUCT DELETE API 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await productCollection.deleteOne(query);
            res.send(singleProduct);
        });

        // ADMIN FILTER
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        });

        // USERS POST
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        // GOOGLE SIGN IN USER CREATE 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // HANDLE ADMIN ROLE
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })



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