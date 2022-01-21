const express = require('express')

const { sequelize, Readings } = require('./db/models')

const app = express()

app.use(express.json())

app.use(function (req, res, next){
    // If allowinga specific site
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // If allowing all sites to send CORS requests - using for development
    res.setHeader('Access-Control-Allow-Origin', '*');

    // *** The next 3 blocks are some examples from https://stackoverflow.com/questions/50968152/cross-origin-request-blocked-with-react-and-express
    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'POST');

    // Request headers you wish to allow
    // .setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
})

app.post('/measurement', async(req, res) => {
    const { temperature, humidity, light } = req.body

    try{
        const readings = await Readings.create({ temperature, humidity, light})
        
        return res.json(readings)
    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

app.get('/measurements', async(req, res) => {
    try{
        const r = await Readings.findAll()
        return res.json(r)
    } catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

app.listen({ port: 4000}, async () => {
    console.log("Server started on http://localhost:4000")
    await sequelize.authenticate()
    console.log("Database connected")
})