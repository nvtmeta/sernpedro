const { verify } = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  const accessToken = req.header('accessToken');
  if (!accessToken) return res.json({ error: 'User not Logged in' });

  try {
    const validToken = verify(accessToken, 'secretKey');
    if (validToken) {
      req.user = validToken;
      return next();
    }
    return res.json('something invalid accessToken');
  } catch (error) {
    console.log(error);
  }
};

module.exports = { validateToken };
