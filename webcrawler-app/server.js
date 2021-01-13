// Imports
import Express from "Express";
import Cors from "Cors";
import mongodb from "mongodb";
import axios from "axios";
import cheerio from "cheerio";

// Constants
const app = new Express();
const port = 8000;
const mongoUrl = "mongodb://localhost:27017/jobsdb";
const mongoClient = mongodb.MongoClient;
const JOB_FAILURE = 0;
const JOB_SUCCESS = 2;
var col = null;


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
    col.find({}).toArray( (err, result) => {
        if (err) {
            console.log("getJobs query error");
            res.sendStatus(500);
            throw err;
        } else {
            console.log(`Returning ${result.length} jobs`);
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
            console.log(`Document ${result} inserted`);
            res.sendStatus(200);
            // asynchronously start crawl job
            startCrawlJob(newJob);
        }
    });
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
    var rawLinks = [];
    fetchUrl(newJob)
    .then((res) => {
        var html = res.data;
        var $ = cheerio.load(html);
        $('a').each( (i, item) => {
            rawLinks.push(item.attribs.href);
        }); 
        var links = [...new Set(rawLinks)]; // removes duplicates
        console.log(`Found ${links.length} links for ${newJob.url}`);
        // store results and status as finished
        addResultsToJob(newJob, links);
        updateJobStatus(newJob, JOB_SUCCESS);
    })
    // if site does not exist / does not respond
    .catch( (err) => {
        console.log(`There was an error in crawl process with id ${newJob._id}... finishing job as error`);
    });
}

async function fetchUrl(newJob) {
    console.log(`Queued up crawling job for ${newJob.url}...`);
    var response = await axios(newJob.url)
    .catch((err) => {
        console.log(`Error in HTTP request: site ${newJob.url} is down or does not exist... finishing job as error`);
        updateJobStatus(newJob, JOB_FAILURE);
    });
    if (response.status !== 200) {
        console.log("Error in HTTP request, status was not 200... finishing job as error");
        updateJobStatus(newJob, JOB_FAILURE);
    }
    return response;
}

async function addResultsToJob(job, resultsList) {
    console.log (`Updating results for job with _id ${job._id}`);
    var query = {
        _id: job._id
    };
    var newValue = {
        $set: {
            results: resultsList
        }
    }
    col.updateOne(query, newValue, (err, result) => {
        if (err) {
            console.log("addResultsToJob query error");
            throw err;
        } else {
            console.log(`... added results to ${job._id}`);
        }
    });
} 

async function updateJobStatus(job, statusCode) {
    console.log (`Updating status job with _id ${job._id}`);
    var query = {
        _id: job._id
    };
    var newValue = {
        $set: {
            status: statusCode
        }
    }
    col.updateOne(query, newValue, (err, result) => {
        if (err) {
            console.log("updateJobStatus query error");
            throw err;
        } else {
            console.log(`... updated status for ${job._id}`);
        }
    });
} 