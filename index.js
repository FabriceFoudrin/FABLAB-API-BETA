const express = require("express");
const cors = require('cors');
const { application_name } = require("pg/lib/defaults");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors());

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Fablab API",
        description: "Déveloper",
        contact: {
          name: "FOUDRIN Fabrice CSI"
        },
        servers: ["http://localhost:5000"]
      }
    },
    // ['.routes/*.js']
    apis: ["./routes/*.js"]
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));






app.use(express.json()) // => req.body




// ROUTES //
require('./routes/users')(app); // USERS
require('./routes/resa')(app); // RÉSERVATIONS
require('./routes/espace')(app); // RÉSERVATIONS
require('./routes/espace_resa')(app); // RÉSERVATIONS
require('./routes/classe')(app); // CLASSE






// LISTENING PORT
app.listen(5000, () => {
    console.log("server is listening on port 5000")
});