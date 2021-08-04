const express = require("express");
const PORT = process.env.PORT || 4000;
const cors = require("cors");

const app = express();
app.use(cors())

// parse requests of content-type: application/json
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./App/Routes/Routes")(app);
app.use('/img', express.static('./img'));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Application test." });
});

// set port, listen for requests
const server = app.listen(PORT, () => console.log(`app listening on port ${PORT}`))

function stop() {
  server.close();
}

module.exports = app;
module.exports.stop = stop;