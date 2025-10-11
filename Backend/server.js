const app = require("./src/app");
const sequelize = require("./src/config/db");
require("./src/models"); // import semua model dari index.js

const PORT = process.env.PORT || 5000;

sequelize.sync({}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
