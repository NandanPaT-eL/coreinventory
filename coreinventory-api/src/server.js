import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDB();
    await connectRedis();

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
