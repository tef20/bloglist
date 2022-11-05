const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  { title: 'title 1', author: 'author 1', url: 'www.blog1.com', likes: 3 },
  { title: 'title 2', author: 'author 2', url: 'www.blog2.com', likes: 1 },
  { title: 'title 3', author: 'author 3', url: 'www.blog3.com', likes: 2 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(2);
});

// test('the first blog is about HTTP methods', async () => {
//   const response = await api.get('/api/blogs');

//   expect(response.body[0].content).toBe('HTML is easy');
// });

afterAll(() => {
  mongoose.connection.close();
});
