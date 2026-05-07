const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri =
  `mongodb://simpleCrudUser:Bd4p70wUlfRD8QUI@ac-k2g5w5n-shard-00-00.vsx8urx.mongodb.net:27017,ac-k2g5w5n-shard-00-01.vsx8urx.mongodb.net:27017,ac-k2g5w5n-shard-00-02.vsx8urx.mongodb.net:27017/?ssl=true&replicaSet=atlas-vx1jfd-shard-0&authSource=admin&appName=Cluster0`

  // Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Root route
app.get('/', (req, res) => {
  res.send('Simple CRUD server is serving!');
});

async function run() {
  try {
    await client.connect();

    const db = client.db('simplecrud');
    const userCollection = db.collection('users');

    // GET all users
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Ping MongoDB
    await client.db('admin').command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}


run().catch(console.dir);

app.listen(port, () => {
  console.log(`Simple CRUD server is running on port ${port}`);
});