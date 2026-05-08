require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;


// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());


// ======================
// MONGODB URI
// ======================

const uri = process.env.MONGODB_URI;


// ======================
// MONGODB CLIENT
// ======================

const client = new MongoClient(uri, {

  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

});


// ======================
// ROOT ROUTE
// ======================

app.get('/', (req, res) => {

  res.send('Simple CRUD server is running successfully!');

});


// ======================
// MAIN FUNCTION
// ======================

async function run() {

  try {

    // CONNECT DATABASE
    await client.connect();

    console.log('Connected to MongoDB successfully!');


    // DATABASE
    const db = client.db('simplecrud');


    // COLLECTIONS
    const userCollection = db.collection('users');

    const resultCollection = db.collection('results');


    // ==================================================
    // USER ROUTES
    // ==================================================


    // GET ALL USERS
    app.get('/users', async (req, res) => {

      const users = await userCollection.find().toArray();

      res.send(users);

    });


    // GET SINGLE USER
    app.get('/users/:id', async (req, res) => {

      try {

        const id = req.params.id;

        const query = {
          _id: new ObjectId(id)
        };

        const user = await userCollection.findOne(query);

        res.send(user);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });


    // CREATE USER
    app.post('/users', async (req, res) => {

      try {

        const newUser = req.body;

        console.log('User to be inserted:', newUser);

        const result = await userCollection.insertOne(newUser);

        res.send(result);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });


    // UPDATE USER
    app.put('/users/:id', async (req, res) => {

      try {

        const id = req.params.id;

        const updatedUser = req.body;

        const query = {
          _id: new ObjectId(id)
        };

        const updateDoc = {

          $set: {

            name: updatedUser.name,

            email: updatedUser.email,

            role: updatedUser.role,

          }

        };

        const result = await userCollection.updateOne(
          query,
          updateDoc
        );

        res.send(result);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });


    // DELETE USER
    app.delete('/users/:id', async (req, res) => {

      try {

        const id = req.params.id;

        const query = {
          _id: new ObjectId(id)
        };

        const result = await userCollection.deleteOne(query);

        res.send(result);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });


    // ==================================================
    // RESULT ROUTES
    // ==================================================


    // GET ALL RESULTS
    app.get('/results', async (req, res) => {

      try {

        const results = await resultCollection.find().toArray();

        res.send(results);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });

    // GET SINGLE RESULT
      app.get('/results/:id', async (req, res) => {

        try {

          const id = req.params.id;

          const query = {
            _id: new ObjectId(id)
          };

          const result = await resultCollection.findOne(query);

          res.send(result);

        }

        catch (error) {

          res.status(500).send({
            error: true,
            message: error.message
          });

        }

      });

    // CREATE RESULTS
    app.post('/results', async (req, res) => {

      try {

        const resultsData = req.body;

        const result = await resultCollection.insertMany(resultsData);

        res.send(result);

      }

      catch (error) {

        res.status(500).send({
          error: true,
          message: error.message
        });

      }

    });


    // PING DATABASE
    await client.db('admin').command({ ping: 1 });

    console.log('Pinged MongoDB deployment successfully!');

  }

  catch (error) {

    console.error(error);

  }

}


// RUN SERVER
run().catch(console.dir);


// ======================
// SERVER LISTEN
// ======================

app.listen(port, () => {

  console.log(`Server is running on port ${port}`);

});