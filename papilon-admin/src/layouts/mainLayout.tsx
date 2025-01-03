import React, { ReactNode } from 'react';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import '../layouts/mainLayout.css'

interface MainLayoutProps {
  showSearch?: boolean;
  showTitle?: boolean;
  title?: string;
  showMenu?: boolean;
  showButton?:boolean;
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  showSearch = false, 
  showTitle = false, 
  title = "My Website", 
  showMenu = false,
  showButton= false, 
  children 
}) => {
  return (
    <div>
      <Header showSearch={showSearch} showTitle={showTitle} title={title} showMenu={showMenu} showButton={showButton}/>
        {children} 
      <Footer />
    </div>
  );
};

export default MainLayout;

