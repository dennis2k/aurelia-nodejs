const express = require('express')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
const app = express()
const router = express.Router()
const cors = require("cors");

//Setup parsing & cors
app.use(cors({credentials: true, origin: 'http://localhost:9000'}));
app.use(bodyParser.json({limit: '50mb'}))
app.use(methodOverride())

mongoose.connect('mongodb://fiskepind:fiskepind1337@ds033986.mlab.com:33986/keeper-db')

//Routes
require("./routes")(app);
require("./auth/auth.routes")(app);
app.use(router)

//Launch
app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})