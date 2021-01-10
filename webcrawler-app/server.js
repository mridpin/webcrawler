// Imports
import Express from "Express"
import Cors from "Cors"
import mongodb from "mongodb"

// Constants
const app = new Express();
const port = 8000;
const mongoUrl = "mongodb://localhost:27017/jobsdb"
const mongoClient = mongodb.MongoClient;
// var db = null;
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
    var jobs = [];
    col.find({}).toArray( (err, result) => {
        if (err) {
            console.log("getJobs query error");
            res.sendStatus(500);
            throw err;
        } else {
            jobs.push(result); // try to concat here
            console.log(`Returning ${jobs.length} jobs`);
            res.send(result);
        }
    });
});

// POST endpoint to queue up a job
app.post("/jobs", (req, res) => {
    console.log(`Got body: ${req.body.targetJobUrl}`); // needs validation
    col.insertOne(newJob, (err, result) => {
        if (err) {
            console.log("getJobs query error");
            res.sendStatus(500);
            throw err;
        } else {
            jobs.push(result); // try to concat here
            console.log(`Returning ${jobs.length} jobs`);
            res.sendStatus(200);
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
        console.log("MongoDB database created!");
        // db = client.db("jobsdb");
        col = client.db("jobsdb").collection("jobs");
        // insert default data
        // var job1 = {
        //     id: 1,
        //     url: "example.com", 
        //     status: 0
        // };
        // var job2 = {
        //     id: 2,
        //     url: "google.com",
        //     status: 1
        // };
        // var job3 = {
        //     id: 3,
        //     url: "wikipedia.com",
        //     status: 2
        // };
        // col.insertOne(job1, (err, res) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`Inserted job ${job1.id}`);
        // });
        // col.insertOne(job2, (err, res) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`Inserted job ${job2.id}`);
        // });
        // col.insertOne(job3, (err, res) => {
        //     if (err) {
        //         throw err;
        //     }
        //     console.log(`Inserted job ${job3.id}`);
        // });
    }
});

// Server start
app.listen(port, () => console.log(`Server started. Listening on port ${port} ....`));