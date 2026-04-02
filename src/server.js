const app = require("./app");
const { initializeDatabase } = require("./config/db");

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Finance dashboard backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

bootstrap();
