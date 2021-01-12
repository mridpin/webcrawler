/* This file handles the webcrawling logic of the application */

// Imports
import axios from "axios"
import cheerio from "cheerio"

// Constants

export function startCrawlJob(targetJobUrl) {
    var links = [];
    fetchUrl(targetJobUrl).then((res) => {
        var html = res.data;
        var $ = cheerio.load(html);
        $('a').each( (i, item) => {
            links.push(item.attribs.href);
        }); 
        console.log(links);
        return links;
    })
    // if site does not exist / does not respond
    .catch( (err) => {
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