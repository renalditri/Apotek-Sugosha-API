const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./App/Routes/Routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Application test." });
});

// set port, listen for requests
app.listen(PORT, () => console.log(`app listening on port ${PORT}`))