const express = require('express');
const app = express();
const db = require('./models');
const PORT = 8082;
const PostRouter = require('./routes/Post');
const CommentsRouter = require('./routes/Comments');
const UsersRouter = require('./routes/Users');
const LikesRouter = require('./routes/Likes');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// route
app.use('/posts', PostRouter);
app.use('/comments', CommentsRouter);
app.use('/auth', UsersRouter);
app.use('/likes', LikesRouter);

// db
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
