const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// middle wares
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zgj4c3m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('services');
        const orderCollection = client.db('geniusCar').collection('orders')

        // findMany
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        // findOne
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        // order api
        app.get('/orders', async(req, res) => {
            let query = {}

            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.patch('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id)}
            const option = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, option)
            res.send(result)
        })

        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('genius car is running')
})

app.listen(port, () => {
    console.log(`genius port is running on ${port}`);
})

