const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(cors())

const CLOUDINARY_CLOUD_NAME = 'dqzcozav8'
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET


app.get('/', (req, res) => {
    try {
        res.status(200).json("Welcome to GMA's 75")
    } catch (error) {
        res.status(500).json({error})
    }
})

app.get('/api/photos', async (req, res) => {
    try {
        const response = await axios.get(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload`,
            {
                auth: {
                    username: CLOUDINARY_API_KEY,
                    password: CLOUDINARY_API_SECRET,
                },
                params: {
                    max_results: 20,
                },
            }
        )
    
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = app