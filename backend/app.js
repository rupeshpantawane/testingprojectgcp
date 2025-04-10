const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require('express-fileupload');


//Custome Plugins
const config = require("./services/app.service");
const adminRouter = require("./routes/admin.router");
// end 
app.use(fileupload());
//ejs Plugin 
app.engine('html', require('ejs').renderFile);
// end
app.use(express.json({ limit: '25mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/storage', express.static(__dirname + '/storage'));

//User Routes
app.use("/api/admin", adminRouter);


// simple route
app.get("/", (_req, res) => {
  res.json({ message: "server working..." });
});

const PORT = process.env.PORT || config["port"];
let server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
