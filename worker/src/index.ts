import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string){
    const { problemId, code, language } = JSON.parse(submission);

    console.log(`processing submission for problem id ${problemId}`);
    console.log(`code: ${code}`);
    console.log(`language: ${language}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`finished processing submission for problemId ${problemId}`);
}

async function startWorker(){
    try {
        await client.connect();
        console.log("Worker connected to Redis");

        while(true){
            try {
                const submission = await client.brPop("submissions", 0);
                await processSubmission(submission.element);
            } catch (error) {
                console.error("Error processing submission: ", error);
            };
        };
    } catch (error) {
        console.error("Error starting worker: ", error);
    };
};

startWorker();