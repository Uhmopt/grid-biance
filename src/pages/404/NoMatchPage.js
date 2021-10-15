import React, { useContext } from 'react';
import Container from '../../components/Container';
import PageContent from '../../components/PageContent';
import back from '../../assets/img/404-back.svg';
import backDark from '../../assets/img/404-back-dark.svg';
import backMobile from '../../assets/img/404-back-mobile.svg';
import backMobileDark from '../../assets/img/404-back-mobile-dark.svg';
import { ReactSVG } from 'react-svg';
import { ThemeContext } from '../../components/Theme';

export default function PageNotFound() {
  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme;

  return (
    <div className={theme}>
      <div className="page-not-found-back position-relative">
        <PageContent>
          <div className="page-not-found">
            <ReactSVG src={theme === "light" ? back : backDark} className="notfound-back" />
            <ReactSVG src={theme === "light" ? backMobile : backMobileDark} className="notfound-back-mobile" />
            <Container>
              <h1>We can't seem to find the page you're looking for.</h1>
              <a href="/">Return to home page</a>
            </Container>
          </div>
        </PageContent>
      </div>
    </div>
  )
}