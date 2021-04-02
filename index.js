const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const { ObjectID } = require('mongodb')
require('dotenv').config()
const port = 8080;
const app = express()
app.use(bodyParser.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edbhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {


	const productCollection = client.db("fresh-valley").collection("products");
	const orderCollection = client.db("fresh-valley").collection("orders");
	//Create
	app.post('/addProduct', (req, res) => {
		const product = req.body;
		productCollection.insertOne(product)
			.then(result => {
				console.log("data added succesfully", result);
				res.redirect('/')
			})
	})
	//Read
	app.get('/products', (req, res) => {
		productCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Read
	app.get('/products/:id', (req, res) => {
		productCollection.find({ _id: ObjectID(req.params.id) })
		.toArray((err, documents) => {
			res.send(documents[0]);
		})
	})
	//Delete
	app.delete('/delete/:id', (req, res) => {
		productCollection.deleteOne({ _id: ObjectID(req.params.id) })
			.then(result => {
				console.log(result, "deleted succesfully from database");
			})
	})
	//addOrder
	app.post('/addOrder', (req, res) => {
		const order = req.body;
		orderCollection.insertOne(order)
			.then(result => {
				res.send(result.insertedCount > 0);
			})
	})
	//Read Order
	app.get('/orders', (req, res) => {
		orderCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})




});

app.listen(process.env.PORT || port)



