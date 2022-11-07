const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when db contains some blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('all blogs are returned', async () => {
    const { body } = await api.get('/api/blogs');

    expect(body).toHaveLength(helper.initialBlogs.length);
  }, 100000);
});

describe('viewing a specific blog', () => {
  test('the first blog can be viewed', async () => {
    const { body } = await api.get('/api/blogs');
    const { author } = helper.initialBlogs[0];
    const result = body.some((blog) => blog.author === author);

    expect(result).toBe(true);
  }, 100000);

  test('the blogs have unique identifier property id', async () => {
    const { body } = await api.get('/api/blogs');

    expect(body[0].id).toBeDefined();
  }, 100000);
});

describe('addition of new blog', () => {
  test('POST request creates a new, correctly defined blog post', async () => {
    const [title, author, url, likes] = [
      'title 4',
      'author 4',
      'www.blog4.com',
      7,
    ];
    await api.post('/api/blogs').send({
      title,
      author,
      url,
      likes,
    });

    const { body } = await api.get('/api/blogs');

    expect(body.length).toBe(helper.initialBlogs.length + 1);

    const newBlogExists = body.some(
      (blog) =>
        blog.title === title &&
        blog.author === author &&
        blog.url === url &&
        blog.likes === likes
    );
    expect(newBlogExists).toBe(true);
  }, 100000);

  test("POST request that doesn't specify likes initialises likes to 0", async () => {
    await api.post('/api/blogs').send({
      title: 'title 4',
      author: 'author 4',
      url: 'www.blog4.com',
      // // likes: 7,
    });

    const { body } = await api.get('/api/blogs');
    expect(body[body.length - 1].likes).toBe(0);
  }, 100000);

  test("POST request that doesn't specify title, author, or url responds with status code 400 Bad Request", async () => {
    // missing title
    await api
      .post('/api/blogs')
      .send({
        // // title: 'title 4',
        author: 'author 4',
        url: 'www.blog4.com',
        likes: 7,
      })
      .expect(400);

    // missing author
    await api
      .post('/api/blogs')
      .send({
        title: 'title 4',
        // // author: 'author 4',
        url: 'www.blog4.com',
        likes: 7,
      })
      .expect(400);

    // missing URL
    await api
      .post('/api/blogs')
      .send({
        title: 'title 4',
        author: 'author 4',
        // // url: 'www.blog4.com',
        likes: 7,
      })
      .expect(400);
  }, 100000);
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204, if ID is valid', async () => {
    const blogForRemoval = await Blog.findOne();
    const idForRemoval = blogForRemoval.id;
    await api.delete(`/api/blogs/${idForRemoval}`).expect(204);

    const blogs = await helper.blogsInDb();
    const blogRemains = blogs.some((blog) => blog.id === idForRemoval);

    expect(blogRemains).toBe(false);
  }, 100000);

  test('fails with status code 400, if ID is invalid', async () => {
    const badId = await helper.nonExistingId();
    await api.delete(`/api/blogs/${badId}`).expect(400);
  }, 100000);
});

describe('updating of a blog', () => {
  test('succeeds with status code 200, if ID is valid', async () => {
    const blogForUpdating = await Blog.findOne({});
    const idForUpdating = blogForUpdating.id;
    const updatedLikes = blogForUpdating.likes + 1;
    await api
      .put(`/api/blogs/${idForUpdating}`)
      .send({ likes: updatedLikes })
      .expect(200);

    const updatedBlog = await Blog.findById(idForUpdating);

    expect(updatedBlog.likes).toBe(updatedLikes);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
