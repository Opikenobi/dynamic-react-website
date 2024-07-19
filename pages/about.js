import Layout from './components/Layout';
import { getMarkdownContent } from '../lib/markdown';

const About = ({ contentHtml }) => {
  return (
    <Layout pageTitle="About Me">
      <div className="content-box" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export async function getStaticProps() {
  const { contentHtml } = await getMarkdownContent('about.md');
  return { props: { contentHtml } };
}

export default About;