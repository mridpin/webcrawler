<template>
  <div class="hello">
    <h1>Webcrawler</h1>
    <div>
      <table>
        <thead>
          <th>Webcrawl job</th>
          <th>Status</th>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.id }}</td>
            <td>{ job.url }}</td>
          </tr>
          <tr>
            <td>Job 1</td>
            <td>Ready</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <form>
        <div class="field">
          <label class="label" for="url">Url: </label>
          <div class="control">
            <input
              class="input"
              id="url"
              v-model="targetUrl"
              type="text"
              placeholder="Url"
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
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
