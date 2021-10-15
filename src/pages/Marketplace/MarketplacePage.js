import AvatarGrid from "components/AvatarGrid";
import TabContainer, { TabItem } from "components/TabContainer";
import React, { useContext } from "react";
import CellMarketTable from "../../components/CellMarketTable";
import CellMarketTableMobile from "../../components/CellMarketTableMobile";
import Container from "../../components/Container";
import PageContent from "components/PageContent";
import { ThemeContext } from "components/Theme";

export default function MarketplacePage(props) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;

  // const avatars = [
  //   {
  //     name: "demo name",
  //     value: "23334.23",
  //     color: "#981243",
  //     avatar: "",
  //   },
  //   {
  //     name: "demo name",
  //     value: "23334.23",
  //     color: "#F3A0BC",
  //     avatar: "",
  //   },
  // ];

  return (
    <div className={theme}>
      <PageContent>
        <div className="marketplace-page">
          <Container>
            <h1>marketplace</h1>
            <p className="page-description">
              Below you can find all CELLs currently for sale. Each CELL has its
              own unique coordinates on the grid and can be bought, sold or
              transferred. Hover over each table column header to find out what
              it means.{" "}
            </p>
            <TabContainer>
              <TabItem title="cell list">
                <CellMarketTableMobile theme={theme} />
                <CellMarketTable theme={theme} {...props} />
              </TabItem>
              {/* <TabItem title="avatar list">
                <AvatarGrid theme={theme} data={avatars} />
              </TabItem> */}
            </TabContainer>
          </Container>
        </div>
      </PageContent>
    </div>
  );
}
