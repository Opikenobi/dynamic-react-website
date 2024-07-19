import { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Layout = ({ children, pageTitle }) => {
  const [navbarWidth, setNavbarWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setNavbarWidth(document.querySelector('nav').offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <header>
      <h3>Your Website</h3>
      </header>
      <Navbar onWidthChange={setNavbarWidth} />
      <div className="content">
        <div className="content-box" style={{ minWidth: navbarWidth }}>
          {children}
        </div>
      </div>
      <footer>
        &copy; {new Date().getFullYear()} This website has been built by Yannick Chairi | Chairi.IT. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;

