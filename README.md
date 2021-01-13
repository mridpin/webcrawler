# Webcrawler
## Requirements
The tech stack used for this project is as follows, with the following dependencies
* Data storage: MongoDB v4.4.3
* Server: NodeJS v15.4.0
    * Axios v0.21.1 -> Perform HTTP request to download page from target url
    * Cheerio v1.0.0 -> Navigate the DOM to find the URLs
    * Cors v2.8.5 -> Prevent CORS errors when working with localhost
    * Express v4.17.1 -> Rest server
    * MongoDB v3.6.3 -> Driver for data storage
* UI: Vue v2.6.11
    * Axios v0.21.1 -> Perform HTTP requests from the UI to the server
    * Bulma v0.9.1 -> CSS framework for responsiveness
    * Core-JS v3.6.5 -> Core JS library
    * Vue v2.6.11 -> Core Vue library
    
## How to run the app
1. Start your MongoDB service to run in the background
2. Download source code or zip
3. To start the server:
    * Navigate to webcrawler-app
    * Run `npm install` to download the dependencies
    * Run `npm start` to run the server. Server will listen on port 8000
4. To start the UI:
    * Navigate to webcrawler-app
    * Run `npm install` to download the dependencies
    * Run `npm run serve` to run the UI. UI will be available on port 8080
5. Open localhost:8080 and start crawling jobs by submitting the url in the form. The URL must be complete, so remember to include `http(s)://...`. The table with automatically update the jobs status. Click on a job to view its results. For simplicity, there is no URL validation, if the URL is not valid, it will be displayed as a job unsuccessfully finished with error.
    
## App logic

The server has two endpoints available:
1. GET /jobs -> Returns a list of stored jobs. This endpoint is called by the UI on page load, and polled periodically to dynamically update the table
2. POST /jobs -> Requires a `targetJobUrl` parameter in the body. The workflow pipeline for this process is asynchronous, and performed as follows:
    1. Create new empty job object with status in progress and store it in the database. Start a crawl job
    2. Request target page
    3. Navigate target page and find all links. A link is an element under the <a> html tag
    4. Add list of links to job object and store them in the database
    5. Set status of job to success
    6. If at any point there is an error, for example, the target site is down, the crawl job will be displayed as finished with error and no links will be shown
