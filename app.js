const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Styles
app.use(express.static(__dirname + '/public'));

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App is listening on http://localhost:${PORT}`));
