const express = require('express');
const { MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors')
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jhiz8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db("carsales");
        const carCollection  = database.collection("cars");
        const ordersCollection  = database.collection("orders");

        //fetch chunck of cars
        app.get('/car-short',async(req,res) => {
            const cursor = carCollection.find({}).limit(8);
            const cars = await cursor.toArray();
            res.send(cars);
        });

        app.get('/car/:id', async (req,res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            res.json(result);

        });

        app.post('/order-add',async(req,res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
            
        });

        app.get('/all-orders/:email',async(req,res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        

    }finally{

    }

}
run().catch(console.dir)

app.get('/',async(req,res) => {
    res.send('Hello');
});

app.listen(port,()=> {
    console.log(`listen ${port}`);
})

                                                                                                                                               
