import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout dark-theme">
      <Navbar />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
