import 'dotenv/config'
import express from 'express'
import { UserRouter } from './routes/UserRouter'
import { ContentRouter } from './routes/ContentRouter'
import { BrainRouter } from './routes/BrainRouter'
import cors from 'cors'

const PORT = process.env.PORT || 3001;
const WEBSITE_URL = process.env.WEBSITE_URL;

const app = express();

app.use(cors({
    origin: [`${WEBSITE_URL}`, 'http://localhost:5173']
}))
app.use(express.json())
app.use('/v1/user', UserRouter)
app.use('/v1/content', ContentRouter)
app.use('/v1/brain', BrainRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        message: "SecondBrain Test"
    })
})

app.listen(PORT);