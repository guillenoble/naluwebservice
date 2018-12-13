const express = require("express");
const markers = require("./routes/markers");
const app = express();
require("./connectors/mongo");
//require("dotenv").config();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use("/markers", markers);

app.listen(port, () => console.log(`Listening on port ${port}`));
