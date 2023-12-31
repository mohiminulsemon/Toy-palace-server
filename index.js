const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// console.log(process.env.DB_PASS)

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.02w34e6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db("toydb").collection("toys");

    app.get('/',(req, res) => {
        res.send('toy server is running');
    })

    // insert a toy into the collection
    app.post("/add-toys", async(req, res) => {
        const data =req.body;
        console.log(data);
        const result = await toyCollection.insertOne(data);
        res.send(result);
    });

    //find all the data
    app.get('/all-toys',async(req, res) => {
        const toys = toyCollection.find();
        const result = await toys.toArray();
        res.send(result);
    })

    // update toys data
    app.patch('/toys/:id', async(req,res) => {
      const id = req.params.id;
      const updatedToysData = req.body;
      const filter = {_id : new ObjectId(id)}
      const updatedDoc={
          $set:{
              ...updatedToysData
          }
      }
  
      const result= await toyCollection.updateOne(filter, updatedDoc)
      res.send(result)

    });


    // delete toy data
    app.delete('/toys/:id', async(req,res) => {
      const id = req.params.id;
     
      const filter = {_id : new ObjectId(id)}
 
  
      const result= await toyCollection.deleteOne(filter)
      res.send(result)

    });

    // get one toy information
    app.get('/toys/:id', async(req, res)=>{
      const id= req.params.id
      
      const filter = {_id : new ObjectId(id)}
  
      const data = await toyCollection.findOne(filter)
  
      res.send(data)
  
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`listening on ${port}`);
});