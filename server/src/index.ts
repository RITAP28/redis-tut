import express from 'express';
import { createClient } from 'redis';

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error: ', err));
const app = express();
app.use(express.json());

app.post('/submit', async (req, res) => {
    const { problemId, code, language } : {
        problemId: number,
        code: string,
        language: string
    } = req.body;
    try {
        await client.lPush("submissions", JSON.stringify({ problemId, code, language }));
        res.status(200).json({
            msg: "Submission successfull"
        });
    } catch (error) {
        console.error("Redis Error: ", error);
        res.status(500).json({
            msg: "Submission failed :("
        });
    };
});

async function startServer(){
    try {
        await client.connect();
        console.log("Redis server connected successfully");
        
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    } catch (error) {
        console.error("Error while starting server: ", error);
    };
};

startServer();