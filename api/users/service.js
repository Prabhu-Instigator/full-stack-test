const User = require("./model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const create = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 5) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || user.locked) {
      return res.status(401).json({ message: "Account locked or not found" });
    }

    const isPasswordValid = user.password == password;
    if (!isPasswordValid) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        user.locked = true;
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.failedAttempts = 0;
    await user.save();

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role, username });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (user && user.status != "ACTIVE") {
      return res.status(401).json({ message: "Access denied" });
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const getTime = (req, res) => {
  currentTime = new Date().toISOString();
  res.json({ time: currentTime });
};

const kickout = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);;
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (user.id && user.role != "ADMIN") {
      return res.status(401).json({ message: "Access denied" });
    }
    user.status = "INACTIVE";
    await user.save();
    res.json({ message: `User ${req.body.username} has been kicked out and set to INACTIVE` });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { create, login, authenticate, getTime, kickout };
