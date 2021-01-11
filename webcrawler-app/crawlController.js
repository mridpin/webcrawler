// Imports
import { Worker, isMainThread } from "worker_threads"

// Constants

export function createWorker() {
    if (isMainThread) {
        new Worker("./crawlController.js");
        console.log("Main thread says: Hello World");

    } else {
        console.log("Worker says: Hello World");
    }
}

