import React, { useContext } from 'react';
import HeroBanner from '../../components/HeroBanner';
import JoinTeamSection from '../../components/JoinTeamSection';
import { ThemeContext } from '../../components/Theme';
import WhatIsToken from '../../components/WhatIsToken';

export default function HomePage() {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  return (
    <div className={`main-content ${theme}`}>
      <HeroBanner theme={theme} />
      <WhatIsToken theme={theme} />
      <JoinTeamSection theme={theme} />
    </div>
  )
}