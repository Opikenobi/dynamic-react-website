import { useEffect, useState } from 'react';
import Layout from './components/Layout';

const Advisories = () => {
  const [advisories, setAdvisories] = useState([]);

  useEffect(() => {
    fetch('/api/advisories')
      .then((response) => response.json())
      .then((data) => setAdvisories(data));
  }, []);

  return (
    <Layout pageTitle="Advisories">
    <h2>Advisories</h2>
    <hr></hr>
      <ul className="advisory-list">
        {advisories.map((advisory) => (
          <li key={advisory.slug}>
            <a href={`/advisories/${advisory.slug}`}>
              {advisory.date} - {advisory.title}
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Advisories;