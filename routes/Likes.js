const express = require('express');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Likes } = require('../models');

const router = express.Router();

// post new like
router.post('/', validateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { PostId } = req.body;
    const foundLike = await Likes.findOne({
      where: { PostId: PostId, UserId: id },
    });
    if (!foundLike) {
      const result = await Likes.create({ UserId: id, PostId: PostId });
      return res.json(result);
    } else {
      const result = await Likes.destroy({
        where: { PostId: PostId, UserId: id },
      });
      return res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
