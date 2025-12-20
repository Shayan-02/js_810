const { port } = require("./config/env");
const app = require("./app");

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
