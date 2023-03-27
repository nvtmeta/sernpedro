const express = require('express');
const { validateToken } = require('../middlewares/AuthMiddleware');
const router = express.Router();
const { Posts, Likes } = require('../models');

// get all posts
router.get('/', validateToken, async (req, res) => {
  const listProduct = await Posts.findAll({ include: [Likes] });

  const likePosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listProduct, likePosts });
});

// sequelize need async await
// post new post
router.post('/', validateToken, async (req, res) => {
  const post = req.body;
  post.userName = req.user.userName;
  await Posts.create(post);
  res.json(post);
});

// find post by id to render this post detail page
router.get('/byId/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Posts.findByPk(id);
    if (result) return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json(result);
  }
});
// find post by user to render this user's post detail page
router.get('/byUser/:userName', async (req, res) => {
  const userName = req.params.userName;
  try {
    const listOfPosts = await Posts.findAll({
      where: { userName },
      include: [Likes],
    });
    return res.status(200).json(listOfPosts);
  } catch (error) {
    console.log(error);
    return res.status(400).json(result);
  }
});

router.delete('/:postId', validateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const result = await Posts.destroy({
      where: {
        id: postId,
      },
    });
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
});

// update post title
router.put('/title', validateToken, async (req, res) => {
  try {
    const { newTitle, id } = req.body;
    const result = await Posts.update({ title: newTitle }, { where: { id } });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});
// update postText
router.put('/postText', validateToken, async (req, res) => {
  try {
    const { postText, id } = req.body;
    const result = await Posts.update({ postText }, { where: { id } });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
