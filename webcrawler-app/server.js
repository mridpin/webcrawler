// Imports
import Express from "Express"

// Constants
const app = Express();
const port = 8000;

// Configs
app.use(Express.json());

// Endpoints

// default endpoint to check if working
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// GET endpoint to display data for all jobs (poll)
app.get("/jobs", (req, res) => {
    var jobs = [];
    // hardcoded for now
    var job1 = {
        id: 1,
        url: "example.com", 
        status: 0
    };
    jobs.push(job1);
    var job2 = {
        id: 2,
        url: "google.com",
        status: 1
    };
    jobs.push(job2);
    var job3 = {
        id: 3,
        url: "wikipedia.com",
        status: 2
    };
    jobs.push(job3);
    res.send(jobs);
});

// POST endpoint to queue up a job
app.post("/jobs", (req, res) => {
    console.log(`Got body: ${req.body.targetUrl}`); // needs validation
    res.sendStatus(200);
});

// GET to get results from 1 job
app.get("/jobs/:id", (req, res) => {
    console.log(`Returning job with id=${req.params.id}`);
    var job = {
        id: 1,
        url: "example.com",
        results: ["example.com/uno", "example.com/dos"],
        status: 1
    };
    res.send(job);
});

// Server start
app.listen(port, () => console.log(`Server started. Listening on port ${port} ....`));