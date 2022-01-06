const express = require('express')

const { sequelize, Readings } = require('./models')

const app = express()

app.use(express.json())

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

app.listen({ port: 3000}, async () => {
    console.log("Server started on http://localhost:3000")
    await sequelize.authenticate()
    console.log("Database connected")
})