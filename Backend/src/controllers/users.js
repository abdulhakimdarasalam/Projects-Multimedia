const getAllUsers = (req, res) => {
  res.send("GET users");
};

const createUser = (req, res) => {
  res.send("POST users");
};

module.exports = {
  getAllUsers,
  createUser,
};
