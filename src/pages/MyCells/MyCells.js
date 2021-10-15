import MyCellsPanel from "components/MyCellsPanel";
import { SubPageLoading } from "components/Widget";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toastMessage } from "store/actions/appAction";
import { getAuctionCells } from "store/actions/cellsAction";
import Container from "../../components/Container";
import PageContent from "../../components/PageContent";
import { ThemeContext } from "../../components/Theme";

export default function MyCells(props) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const account = useSelector((state) => state?.app)?.account ?? null;
  const dispatch = useDispatch();
  const history = useHistory();
  const connector = props?.connector || null;
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);

  const populateMyCells = async () => {
    try {
      let cellData = [];
      //get the auction cell by owner address
      let auctionCell = await getAuctionCells(account);
      if (auctionCell.length > 0) {
        auctionCell = auctionCell.map((item) => {
          return {
            id: Number(item.cell_id),
            coordinates: [Number(item.x), Number(item.y)],
            owner: account,
            properties: item?.properties,
            team: Number(item?.team),
            type: "auction",
          };
        });
        cellData = [...cellData, ...auctionCell];
      }

      let gridCellContract = connector.getContract("gridCell");
      if (typeof gridCellContract === "undefined") {
        toastMessage(dispatch, "Could not connect to GridCell contract");
        setLoading(false);
        return;
      }

      let result = await gridCellContract.balanceOf(account);
      if (!result) {
        setLoading(false);
      } else if (result.toNumber() <= 0) {
        setLoading(false);
      } else {
        await Promise.all(
          Array.from(Array(result.toNumber()).keys()).map(async (i) => {
            let gridCellId = await gridCellContract.tokenOfOwnerByIndex(
              account,
              i
            );
            let cellResult = await gridCellContract.getCell(gridCellId);
            cellData.push({
              id: cellResult.cellId.toNumber(),
              coordinates: cellResult.coordinates,
              properties: cellResult.properties.toString(),
              team: cellResult.team,
              owner: cellResult.owner,
              type: "none",
            });
          })
        );
      }

      setCells(cellData);
    } catch (error) {
      console.log(error, "populateMyCells()");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (account) {
      setLoading(true);
      populateMyCells();
    } else {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (cells.length === 1) {
      history.push(`/cell/${cells[0].id}/claim`);
    }
  }, [cells.length]);

  return (
    <div className={theme}>
      <PageContent>
        <div className="my-cells">
          <Container>
            {loading ? (
              <SubPageLoading theme={theme} />
            ) : Number(cells?.length) > 0 ? (
              <>
                <h2>MY CELLS</h2>
                <MyCellsPanel theme={theme} data={cells ?? []} />
              </>
            ) : (
              <>
                <h2>MY CELLS</h2>
                <p>
                  You don't currently own any CELLs, buy one on the{" "}
                  <span
                    onClick={() => history.push("/market/1")}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Marketplace
                  </span>
                  !
                </p>
              </>
            )}
          </Container>
        </div>
      </PageContent>
    </div>
  );
}
