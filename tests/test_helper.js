const Blog = require('../models/blog');

const initialBlogs = [
  { title: 'title 1', author: 'author 1', url: 'www.blog1.com', likes: 3 },
  { title: 'title 2', author: 'author 2', url: 'www.blog2.com', likes: 1 },
  { title: 'title 3', author: 'author 3', url: 'www.blog3.com', likes: 2 },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon', date: new Date() });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
};
