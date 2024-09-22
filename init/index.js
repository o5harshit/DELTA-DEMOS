const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data =   initData.data.map((obj) => 
    ({...obj, owner: "66aca263c3aab549f0e697ca", }));
  console.log(initData.data);
  await Listing.insertMany( initData.data);
  console.log("data was initialized");
};

initDB();
