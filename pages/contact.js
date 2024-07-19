import Layout from './components/Layout';
import { getMarkdownContent } from '../lib/markdown';

const Contact = ({ contentHtml }) => {
  return (
    <Layout pageTitle="Contact">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Layout>
  );
};

export async function getStaticProps() {
  const { contentHtml } = await getMarkdownContent('contact.md');
  return { props: { contentHtml } };
}

export default Contact;