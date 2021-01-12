/* This file handles the server logic and database access of the application */

// Imports
import Express from "Express"
import Cors from "Cors"
import mongodb from "mongodb"
import axios from "axios"
import cheerio from "cheerio"
// import { startCrawlJob } from "./crawlController.js"

// Constants
const app = new Express();
const port = 8000;
const mongoUrl = "mongodb://localhost:27017/jobsdb"
const mongoClient = mongodb.MongoClient;
var col = null

// Configs
app.use(Express.json());
app.use(Cors()); // allow http from localhost

// Endpoints
// default endpoint to check if working
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// GET endpoint to display data for all jobs (poll)
app.get("/jobs", (req, res) => {
    // todo: improve ux by returning jobs with no results
    var jobs = [];
    col.find({}).toArray( (err, result) => {
        if (err) {
            console.log("getJobs query error");
            res.sendStatus(500);
            throw err;
        } else {
            jobs.push(result);
            console.log(`Returning ${jobs.length} jobs`);
            res.send(result);
        }
    });
});

// POST endpoint to queue up a job
app.post("/jobs", (req, res) => {
    console.log(`Got body: ${req.body.targetJobUrl}`); // needs validation
    var newJob = {
        url: req.body.targetJobUrl,
        results: [],
        status: 1
    };
    /*
        status 1: crawl job in progress
        status 2: crawl job done
        status 0: crawl job interrupted and finished due to error 
    */
    col.insertOne(newJob, (err, result) => {
        if (err) {
            console.log("postJobs query error");
            res.sendStatus(500);
            throw err;
        } else {
            // todo: queue up crawl job
            console.log(`Document ${result} inserted`);
            res.sendStatus(200);
            // asynchronously start crawl job
            startCrawlJob(newJob);
        }
    });
});

// GET to get results from 1 job
app.get("/jobs/:id", (req, res) => {
    console.log(`Returning job with id=${req.params.id}`);
    var job = {
        id: 1,
        url: "example.com",
        results: ["example.com/uno", "example.com/dos"],
        status: 2
    };
    res.send(job);
});

// Database start
mongoClient.connect(mongoUrl, (err, client) => {
    if (err) {
        console.log("MongoDB connection error!");
        throw err;
    } else {
        console.log("MongoDB database connection created! Using database jobsdb and collection jobs");
        col = client.db("jobsdb").collection("jobs");
    }
});

// Server start
app.listen(port, () => console.log(`Server started. Listening on port ${port} ....`));

function startCrawlJob(newJob) {
    var links = [];
    fetchUrl(newJob.url).then((res) => {
        var html = res.data;
        var $ = cheerio.load(html);
        $('a').each( (i, item) => {
            links.push(item.attribs.href);
        }); 
        console.log(links);
        // todo: store results and status as finished
    })
    // if site does not exist / does not respond
    .catch( (err) => {
        // todo: store result of this crawl as error
        console.log("error in crawl");
        console.log(err);
    });
}

async function fetchUrl(url) {
    console.log(`Queued up crawling job for ${url}...`);
    let response = await axios(url).catch((err) => {
        console.log("error in axios");
        // todo: store result of this crawl as error
    });
    if (response.status !== 200) {
        console.log(`Error while crawling site ${url}... finishing as error`);
        // todo: store result of this crawl as error
    }
    return response;
}

