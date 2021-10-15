import React, { useContext } from 'react';
import { ThemeContext } from './Theme';

export default function PageContent({ children }) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  return (
    <div className={`page-content ${theme}`}>
      {children}
    </div>
  )
}