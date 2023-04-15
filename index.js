const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const fs = require("fs");
const dbConfig = require("./config/db.config.js");
const https = require("https");
const app = express();
const IP = require("ip");
const request = require("request");

var corsOptions = {
  //    origin: "https://localhost:3000",
  origin: "https://main--bppnjg-dev.netlify.app",
  credentials: true,
};

app.use(cors(corsOptions));

const logRequests = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} res: ${res.message}`
  );
  next();
};

app.use(logRequests);
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bppnjg-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    // httpOnly: true,
  })
);

const db = require("./models");

db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(
    `mongodb+srv://${dbConfig.HOST}:${dbConfig.HOST}@bppnjgcluster.qwbrwau.mongodb.net/${dbConfig.CLUSTER}?retryWrites=true&w=majority`,
    {
      //     .connect('mongodb+srv://<dbuser>:<dbpassword>@bppnjgcluster.qwbrwau.mongodb.net/<dbname>?retryWrites=true&w=majority', {
      // .connect('mongodb+srv://bppnjgdev:bppnjgdev@bppnjgcluster.qwbrwau.mongodb.net/bppnjgcluster?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // funkcja do odpalania seedera po połączeniu do bazy
    // initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bppnjg backend." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/article.routes")(app);
require("./routes/gallery.routes")(app);
// require("./routes/gallery.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// HTTPS options
// const options = {
//   key: fs.readFileSync("./common/key.pem"),
//   cert: fs.readFileSync("./common/cert.pem"),
// };
//change to https
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });
app.listen(PORT, console.log(`Server is running on port ${PORT}.`));

const localIp = IP.address();
console.log("Local IP address: " + localIp);

request("https://api.ipify.org", (error, response, body) => {
  if (!error && response.statusCode === 200) {
    const globalIp = body;
    console.log("Global IP address: " + globalIp);
  } else {
    console.error("Unable to get global IP address: " + error);
  }
});
