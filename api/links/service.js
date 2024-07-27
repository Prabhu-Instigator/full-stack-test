const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const User = require("../users/model");
const OneTimeLink = require("./model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const LINK_EXPIRATION_MINUTES = process.env.LINK_EXPIRATION_MINUTES || 10
const PORT = process.env.PORT || 3000;

const create = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + parseInt(LINK_EXPIRATION_MINUTES) * 60000);

    await OneTimeLink.create({
      userId: user.id,
      token,
      expiresAt
    });

    const link = `http://localhost:${PORT}/validate-link/${token}`;
    res.json({ link });
  } catch (error) {
    res.status(500).json({ message: 'Error generating link' });
  }
};

const validate = async (req, res) => {
  const { token } = req.body;

  try {
    const oneTimeLink = await OneTimeLink.findOne({ where: { token, used: false } });
    if (!oneTimeLink) {
      return res.status(400).json({ message: 'Invalid or expired link' });
    }

    if (new Date() > oneTimeLink.expiresAt) {
      return res.status(400).json({ message: 'Link has expired' });
    }

    const user = await User.findByPk(oneTimeLink.userId);
    const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    oneTimeLink.used = true;
    await oneTimeLink.save();

    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: 'Error validating link' });
  }
};

module.exports = { create, validate };
