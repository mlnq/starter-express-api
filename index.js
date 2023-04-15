const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const dbConfig = require("./config/db.config.js");

var corsOptions = {
  //    origin: "https://localhost:3000",
  origin: "https://main--bppnjg-dev.netlify.app",
  credentials: true,
};

app.use(cors(corsOptions));

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
const PORT = process.env.PORT || 8080;
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, console.log(`Server is running on port ${PORT}.`));

app.listen(process.env.PORT || 3000);
