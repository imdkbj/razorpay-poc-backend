require("custom-env").env("local");

const db = require("./src/db");
const app = require("./src/app");

const PORT = process.env.PORT;

(async () => {
  const resp = await db();
  if (!resp?.isConnected) {
    console.log("DB connection failed.");
    return;
  }
})();

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
