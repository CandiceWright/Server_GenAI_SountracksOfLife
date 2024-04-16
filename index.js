const http = require('http');
const express = require('express');
var cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(7342, () => {
  console.log('HTTP Server running on port 7342');
});

/****************** Test Route *********************/
app.get('/test', proof);
function proof(request, response) {
    response.send("Hi I am working. What do you need.");
}

app.post('/songlyrics', generateLyrics);
async function generateLyrics(request, response) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    var data = request.body;
    var genre = data.genre;
    var emotion1 = data.emotion1;
    var emotion2 = data.emotion2;
    var gratitudeText = data.gratitudeText;
    var bestQuality = data.bestQuality;
    var worstQuality = data.worstQuality;
    var dream = data.dream;
    var bestThisMonth = data.bestThisMonth;
    var prompt = `I am going to provide you some details about me and my life. Create song lyrics that describe me and my life. The song will be titled my soundtrack of life. Make the song have a ${genre} feel. Label each section of the lyrics. These are the details about me and my life you should use in the lyrics: The emotions I'm feeling most in my life are ${emotion1} and ${emotion2}. I am most grateful for ${gratitudeText}. The best quality about me is ${bestQuality} and my worst quality is ${worstQuality}. I dream of ${dream}. The best thing that has happened to me this month is ${bestThisMonth}.`
    console.log(prompt);
    const result = await model.generateContent(prompt);
    const apiresponse = await result.response;
    const text = apiresponse.text();
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.statusCode = 200
    console.log(text);
    response.send(text);
    //response.send("Hi I am working. What do you need.");
}