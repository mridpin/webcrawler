<template>
  <div class="hello">
    <div>
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <th>Crawl job ID</th>
          <th>Crawl job URL</th>
          <th>Status</th>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs"
            :key="job._id"
            v-on:click="getJobById(job._id)"
          >
            <td>{{ job._id }}</td>
            <td>{{ job.url }}</td>
            <td>{{ statusCode[job.status] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-bind:class="{ 'is-active': showDataUrls }" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <h1 class="moda-card-title title is-4">ULRs found for this target</h1>
        </header>
        <section class="modal-card-body" id="wallets-container">
          <h4 class="title is-6">Crawl job for: {{ openJob.url }}</h4>
          <div
            class="content"
            v-bind:class="{ 'is-active': openJob.status === 2 }"
          >
            <ul>
              <li v-for="result in openJob.results" :key="result">
                <a :href="result"> {{ result }} </a>
              </li>
            </ul>
          </div>
          <div
            class="content"
            :class="[openJob.status === 1 ? '' : 'is-hidden']"
          >
            <p>Not ready yet</p>
          </div>
          <div
            class="content"
            :class="[openJob.status === 0 ? '' : 'is-hidden']"
          >
            <p>Error in crawl</p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button" v-on:click="showDataUrls = false">
            Close
          </button>
        </footer>
      </div>
    </div>
    <div>
      <form>
        <div class="field">
          <label class="label" for="url">Url: </label>
          <div class="control">
            <input
              class="input"
              id="url"
              type="text"
              placeholder="Url"
              v-model="targetJobUrl"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <input
              class="button"
              id="url"
              type="button"
              value="Send"
              v-on:click="postJobs"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// to do
// add get all jobs on load -> done
// add post job on click -> done
// add get 1 job on click -> done
// display all urls found for job -> done
import axios from "axios";

const jobsURL = "http://localhost:8000/jobs";

const statusCode = {
  0: "Error",
  1: "In progress",
  2: "Finished"
}

export default {
  name: "Webcrawler",
  data: function () {
    // init page data
    return {
      jobs: [],
      targetJobUrl: "",
      openJob: {},
      showDataUrls: false,
      statusCode
    };
  },
  methods: {
    // recover jobs
    getJobs: function () {
      var self = this;
      axios.get(jobsURL).then(function (response) {
        self.jobs = response.data;
        console.info(
          `Retrieved ${response.data.length} queued jobs from server --> ${response.status}`
        );
      });
    },
    getJobById: function (jobId) {
      var self = this;
      self.showDataUrls = true;
      self.openJob = self.jobs.find((j) => j._id === jobId);
    },
    postJobs: function () {
      var self = this;
      // jobURL validation should go here
      var body = {
        targetJobUrl: self.targetJobUrl,
      };
      axios.post(jobsURL, body).then(function (response) {
        console.log(
          `Queued job for url "${body.targetJobUrl}" --> ${response.status}`
        );
        self.targetJobUrl = "";
        self.getJobs();
      });
    },
  },
  created: function () {
    this.getJobs();
    setInterval(() => {
      this.getJobs();
    }, 5000);
  },
};
</script>