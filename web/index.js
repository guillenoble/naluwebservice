const express = require("express");
const app = express();

app.get("/", (req, res) => res.render("index"));
app.use(express.static("assets"));

app.listen(process.env.PORT || 9000);
