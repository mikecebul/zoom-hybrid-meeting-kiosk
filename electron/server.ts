import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())

app.get('/test', (req, res) => {
    res.json({message: "Test endpoint reached!"})
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})