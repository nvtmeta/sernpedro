const express = require('express');
const { validateToken } = require('../middlewares/AuthMiddleware');
const models = require('../models');
const Comments = models.Comments;
// const Comments = require('../models/Comments');
const router = express.Router();

// get all comments of specific post
router.get('/:PostId', async (req, res) => {
  const PostId = req.params.PostId;
  try {
    const result = await Comments.findAll({
      where: {
        PostId,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

// raw json post new comment
router.post('/', validateToken, async (req, res) => {
  const comment = req.body;

  // get userName from validateToken
  const userName = req.user.userName;
  comment.userName = userName;
  try {
    const result = await Comments.create(comment);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

// delete comment
router.delete('/:commentId', validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  console.log(commentId);
  try {
    const result = await Comments.destroy({
      where: {
        id: commentId,
      },
    });
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
