import Layout from './components/Layout';
import { getMarkdownContent } from '../lib/markdown';

const Home = ({ contentHtml }) => {
  return (
    <Layout pageTitle="Home">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export async function getStaticProps() {
  const { contentHtml } = await getMarkdownContent('home.md');
  return { props: { contentHtml } };
}

export default Home;