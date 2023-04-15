const swaggerAutogen = require("swagger-autogen")();

const glob = require("glob");
const path = require("path");

const outputFile = "./swagger.json";
const endpointsFiles = glob.sync(path.join(__dirname, "./routes/*.js"));
// const outputFile = "./swagger.json";
// const endpointsFiles = [
//     "./routes/auth.routes.js",
//     "./routes/article.routes.js",
// ];
const doc = {
    info: {
        title: "Moja dokumentacja API",
        version: "1.0.0",
        description: "Opis mojego API",
    },
    host: "localhost:8080",
    basePath: "/",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Użytkownik",
            description: "Endpointy dotyczące użytkowników",
        },
    ],
};

// swaggerAutogen(outputFile, endpointsFiles, doc);
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js');
});
