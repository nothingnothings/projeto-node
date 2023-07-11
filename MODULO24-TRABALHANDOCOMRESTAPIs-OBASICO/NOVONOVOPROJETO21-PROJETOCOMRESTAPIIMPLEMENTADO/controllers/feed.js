exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post' }],
  });
};

exports.createPost = (req, res, next) => {
  ///Create post in DB...

  const title = req.body.title;
  const content = req.body.content;

  console.log('REQUEST RECEIVED')
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      title: title,
      content: content,
      id: new Date().toISOString(),
    },
  });
};
