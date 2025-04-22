import React, { ReactNode, useState } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children?: ReactNode; // Make children prop optional
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
