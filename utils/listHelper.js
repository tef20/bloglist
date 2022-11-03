const totalLikes = (blogs) => blogs.reduce((acc, cur) => acc + cur.likes, 0);

const favouriteBlog = (blogs) =>
  blogs.length === 0
    ? null
    : blogs.reduce((fav, cur) => {
        if (cur.likes > fav.likes) return cur;
        return fav;
      });

const highestValueObjectEntry = (obj, valueName, keyName = 'author') =>
  Object.keys(obj).reduce(
    (acc, cur) => {
      const entry = { [keyName]: cur, [valueName]: obj[cur] };
      return entry[valueName] > acc[valueName] ? entry : acc;
    },
    { [valueName]: -1 }
  );

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCountsByAuths = blogs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.author]: cur.author in acc ? acc[cur.author] + 1 : 1,
    }),
    {}
  );
  return highestValueObjectEntry(blogCountsByAuths, 'blogs', 'author');
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuths = blogs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.author]: cur.author in acc ? acc[cur.author] + cur.likes : cur.likes,
    }),
    {}
  );

  return highestValueObjectEntry(likesByAuths, 'likes', 'author');
};

module.exports = { totalLikes, favouriteBlog, mostBlogs, mostLikes };
