const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { MongoClient } = require('mongodb');
const url = process.env.DB_URL || "mongodb+srv://Shruti:Shr1jay20ee@nodeproject-otgtx.mongodb.net/test";
const port = process.env.API_SERVER_PORT || 3000;
let db;


  const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        productAdd,
    },
  };


  async function productAdd(_, { product }) {
    product.id = await getNextSequence('products');
    const result = await db.collection('products').insertOne(product);
    const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
    return savedProduct;

    //productsDB.push(product);
    //return product;
  }

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();
//const enableCors = (process.env.ENABLE_CORS || 'true') == 'true';
//console.log('CORS setting: ',enableCors);

server.applyMiddleware({ app, path: '/graphql'});
//server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

(async function () {
  try {
    app.use(cors());
    await connectToDb();
    app.listen(port, function () {
      console.log(`API started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();