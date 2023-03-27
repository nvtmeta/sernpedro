const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');
// register user
router.post('/register', async (req, res) => {
  const { userName, password } = req.body;
  try {
    // hash with bcrypt
    const hash = await bcrypt.hash(password, 10);
    // create new user
    const result = await Users.create({
      userName,
      password: hash,
    });
    return res.json({
      EC: 0,
      result,
    });
  } catch (error) {
    console.log(error);
  }
});

// login user
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  // find username login
  const user = await Users.findOne({ where: { userName } });
  if (!user) res.json({ Error: "user doesn't exist" });

  try {
    // compare bcrypt password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) res.json({ error: 'wrong username or password ' });

    // jwt

    const accessToken = sign(
      { userName: user.userName, id: user.id },
      'secretKey'
    );

    res.json({ accessToken, userName, id: user.id });
  } catch (error) {
    console.log(error);
  }
});

// auth get data from verify users
router.get('/auth', validateToken, async (req, res) => {
  res.json(req.user);
});

router.get('/basicInfo/:userName', async (req, res) => {
  const userName = req.params.userName;
  try {
    const basicInfo = await Users.findOne({
      where: { userName },
      attributes: { exclude: ['password'] },
    });
    console.log(basicInfo);
    res.json(basicInfo);
  } catch (error) {
    console.log(error);
  }
});

router.put('/changePassword', validateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userName = req.user.userName;
    const user = await Users.findOne({ where: { userName: userName } });
    console.log(user.password);
    // compare old password
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) res.json({ error: 'wrong username or password ' });

    // hash password
    // notice async await is needed for bcrypt
    const hash = await bcrypt.hash(newPassword, 10);
    // create new user
    console.log(hash);
    const result = await Users.update(
      {
        password: hash,
      },
      { where: { userName } }
    );

    res.json(result);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
