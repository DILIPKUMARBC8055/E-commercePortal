import { MongoClient } from "mongodb";

// const url = ;
let client;
export const connectToMongoDb = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("Connected to mongoDb");
      createColletion(clientInstance.db());
      createIndexes(clientInstance.db());
    })
    .catch((err) => console.log(err));
};
export const getDb = () => {
  return client.db();
};
const createColletion = async (db) => {
  const cartCounter = await db
    .collection("counter")
    .findOne({ _id: "cartItemsId" });
  if (!cartCounter) {
    await db.collection("counter").insertOne({ _id: "cartItemsId", value: 0 });
  }
};
const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
  } catch (err) {
    console.log(err);
  }
  console.log("Indexes are created");
};
export const getClient = () => {
  return client;
};
