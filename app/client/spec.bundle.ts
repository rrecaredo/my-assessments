import "./app.ts";

const app = require.context("./app", true, /\.spec\.*/);
app.keys().forEach(app);