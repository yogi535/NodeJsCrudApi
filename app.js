var express = require('express');
var app = express();

const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json())

mongoClient.connect(url, (error,db)=>{
    if(error)
    {
        console.log("error while connecting with mongo db")
    }
    else {

        const myDb = db.db('myDb')
        const collection = myDb.collection('myTable')


        // Create new User

        app.post('/signup',(req, res)=>{

            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            };

            const query = {email: newUser.email}

            collection.findOne(query, (err, result)=>{
                if(result==null){
                    collection.insertOne(newUser, (err, result)=>{
                        res.status(200).send()})

                }
                else 
                {
                    res.send(400).send()
                 console.log("email already exists")
                }
            })

        })


         // Login User

        app.post('/login', (req, res)=> {  
            
            const query = {
                email: req.body.email,
                password: req.body.password
            };

            collection.findOne(query, (error, result)=>{

                if(result!=null)
                {
                const objToSend = {
                    name: result.name,
                    email: result.email
                }

                res.status(200).send(JSON.stringify(objToSend))
                
            }
           
            else {
                res.status(404).send();
            }

         })

        })

    }
})


app.listen(4001, ()=>{
   
    console.log("Listening on port 4001..")

})