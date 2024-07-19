import { useEffect, useState } from 'react';
import Layout from './components/Layout';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch blog posts
    fetch('/api/blog')
      .then((response) => response.json())
      .then((data) => setPosts(data));

    // Fetch TIL entries
    fetch('/api/til')
      .then((response) => response.json())
      .then((data) => setEntries(data));

  }, []);

  return (
    <Layout pageTitle="Blog">
      <h2>Blog</h2>
      <hr></hr>
      <ul className="blog-list">
      {posts.map((post) => (
           <li key={post.slug}>
           <a href={`/blog/${post.slug}`}>{post.date} - {post.title}</a>
         </li>
        ))}
      </ul>

      <h2>TIL</h2>
      <hr></hr>
      <ul className="til-list">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <a href={`/til/${entry.slug}`}>{entry.date} - {entry.title}</a>
          </li>
        ))}
      </ul>
      
    </Layout>
  );
};

export default Blog;