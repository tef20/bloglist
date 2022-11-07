const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if ([title, author, url].includes(undefined)) {
    response.status(400).json({
      error: 'New blog requires title, author, and url to be specified',
    });
  } else {
    const blog = new Blog({ ...request.body, likes: likes ?? 0 });

    const savedBlog = blog.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const itemDeleted = Boolean(await Blog.findByIdAndRemove(id));
  if (itemDeleted) response.status(204).end();
  else response.status(400).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: id },
    { ...request.body },
    { new: true }
  );

  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
