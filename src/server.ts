import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function main() {
  try {
    if (!config.db.uri) {
      throw new Error("DB_URI is not set");
    }
    await mongoose.connect(config.db.uri);
    console.log("MongoDB Connected");
    app.listen(config.port, () => {
      console.log(`App Running on port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});

export default app;
