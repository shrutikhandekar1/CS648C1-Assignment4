/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-restricted-globals: "off" */
/* global db print */
/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.products.remove({});

const productsDB = [
  {
    id: 1,
    productName: 'lululemon',
    price: '3.99',
    category: 'SHIRTS',
    image: 'https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609',
  },
  {
    id: 2,
    productName: 'khaki',
    price: '5.99',
    category: 'JEANS',
    image: 'https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995',
  },
];


db.products.insertMany(productsDB);
const count = db.products.count();
print('Inserted', count, 'products');

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ productName: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ image: 1 });
