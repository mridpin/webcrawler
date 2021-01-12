// Imports
// import { Worker, isMainThread, parentPort } from "worker_threads"
import axios from "axios"
import cheerio from "cheerio"

// Constants

// export function createWorker() {
//     console.log("aaaaaaa");
//     if (isMainThread) {
//         const crawler = new Worker("./crawlController.js");
//         crawler.once ("message", (message) => {
//             console.log("Worker says: " + message);
//         });
//         crawler.postMessage('Main Thread: Hi!');
//     } else {
//         parentPort.once("message", (message) => {
//             console.log(message);
//             parentPort.postMessage("Worker thread: Hello!");
//         });
//     }
// }

export function startCrawlJob(targetJobUrl) {
    fetchUrl(targetJobUrl).then((res) => {
        var html = res.data;
        var $ = cheerio.load(html);
        const links = [];
        $('a').each( (i, item) => {
            links.push(item.attribs.href);
        }); 
        console.log(links);
        // todo: add links to object in database        
    })
    .catch( (err) => {
        // todo: store result of this crawl as error
        console.log(err);
    });
}

async function fetchUrl(url) {
    console.log(`Queued up crawling job for ${url}...`);
    let response = await axios(url).catch((err) => {
        console.log(err)
    });
    if (response.status !== 200) {
        console.log(`Error while crawling site ${url}... finishing as error`);
        // todo: store result of this crawl as error
    }
    return response;
}