const User = require("../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  // res.json(req.decoded)

  res.json({ users });
};

exports.createUser = async (req, res) => {
  // const user = await User.create(req.body)
  const SALT_WORK_FACTOR = 12;
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  req.body.password = await bcrypt.hash(req.body.password, salt);

  User.create(req.body).then(user => res.send("Sign Up success"));
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json({ user });
};

exports.updateUserById = async (req, res) => {
  const [isUpdated] = await User.update(req.body, {
    where: { id: req.params.id }
  });

  if (Boolean(isUpdated)) {
    const user = await User.findById(req.params.id);

    res.json({ user });
  } else {
    res.json({});
  }
};

exports.deleteUserById = async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });

  res.json({});
};

exports.login = async (req, res) => {
  //1.get user account
  const user = await User.findOne({ where: { email: req.body.email } });

  //check user account
  if (user === null) {
    return res.send("User not found!");
  }

  //2.Password validation
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  //check password
  if (!validPassword) {
    return res.send("Password NOT valid!");
  }

  //Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email }, //payload
    process.env.JWT_SECRET, //secret
    { expiresIn: "7d" } //Option
  );
  res.json({
    message: "You are logged in",
    id: user.id,
    token
  });
};
