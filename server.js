const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");
const mongoose = require("mongoose");

let DB_LOCAL = process.env.DATABASE_LOCAL;

if (process.env.NODE_ENV == "production") {
}
const DB = process.env.DATABASE_REMOTE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(process.env.NODE_ENV == "development" ? DB_LOCAL : DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
