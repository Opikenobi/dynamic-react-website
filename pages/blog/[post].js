import fs from 'fs';
import path from 'path';
import { parseMarkdownFile } from '../../lib/markdown';
import Layout from '../components/Layout';

export async function getStaticPaths() {
  const dirPath = path.join(process.cwd(), 'blog');
  const filenames = fs.readdirSync(dirPath);

  const paths = filenames.map((filename) => ({
    params: { post: filename.replace(/\.md$/, '') }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'blog', `${params.post}.md`);
  const { title, contentHtml } = await parseMarkdownFile(filePath);

  return { props: { post: params.post, title, contentHtml } };
}

const Post = ({ title, contentHtml }) => {
  return (
    <Layout pageTitle={title}>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export default Post;