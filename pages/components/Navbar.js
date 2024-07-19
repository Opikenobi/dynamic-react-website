import { useEffect, useRef } from 'react';

const Navbar = ({ onWidthChange }) => {
  const navbarRef = useRef(null);

  useEffect(() => {
    if (navbarRef.current) {
      onWidthChange(navbarRef.current.offsetWidth);
    }
  }, [onWidthChange]);

  return (
    <nav ref={navbarRef}>
      <a href="/">Home</a>
      <a href="/about">About Me</a>
      <a href="/blog">Blog & Advisories</a>
      <a href="/contact">Contact</a>
    </nav>
  );
};

export default Navbar;