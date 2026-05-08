const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// MONGODB URI
const uri =
  'mongodb://simpleCrudUser:Bd4p70wUlfRD8QUI@ac-k2g5w5n-shard-00-00.vsx8urx.mongodb.net:27017,ac-k2g5w5n-shard-00-01.vsx8urx.mongodb.net:27017,ac-k2g5w5n-shard-00-02.vsx8urx.mongodb.net:27017/?ssl=true&replicaSet=atlas-vx1jfd-shard-0&authSource=admin&appName=Cluster0';


// CREATE CLIENT
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Simple CRUD server is serving!');
});


async function run() {

  try {

    await client.connect();

    const db = client.db('simplecrud');

    const userCollection = db.collection('users');


    // GET ALL USERS
    app.get('/users', async (req, res) => {

      const cursor = userCollection.find();

      const result = await cursor.toArray();

      res.send(result);

    });


    // GET SINGLE USER
    app.get('/users/:id', async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      };

      const user = await userCollection.findOne(query);

      res.send(user);

    });


    // CREATE USER
    app.post('/users', async (req, res) => {

      const newUser = req.body;

      console.log('User to be inserted', newUser);

      const result = await userCollection.insertOne(newUser);

      res.send(result);

    });


    // UPDATE USER
    app.put('/users/:id', async (req, res) => {

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

      const result = await userCollection.updateOne(query, updateDoc);

      res.send(result);

    });


    // DELETE USER
    app.delete('/users/:id', async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      };

      const result = await userCollection.deleteOne(query);

      res.send(result);

    });


    // PING DATABASE
    await client.db('admin').command({ ping: 1 });

    console.log('Connected to MongoDB successfully!');

  }

  catch (error) {

    console.error(error);

  }

}


run().catch(console.dir);


// SERVER LISTEN
app.listen(port, () => {

  console.log(`Simple CRUD server is running on port ${port}`);

});