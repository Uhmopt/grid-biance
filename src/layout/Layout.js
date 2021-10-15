import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

export default function Layout(props) {
  return (
    <ThemeProvider theme={lang === "en" ? themeEN : themeDE}>
      {props?.children}
    </ThemeProvider>
  )
}