import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toastMessage } from "store/actions/appAction";

export default function CellDetailHistory(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { gridCellId = 0 } = useParams();

  useEffect(() => {
    console.log(Number(gridCellId, "gridCellID"));
    if (gridCellId <= 0 || isNaN(gridCellId)) {
      toastMessage(dispatch, "Error", "There is no cell!");
      history.push("/");
    }
    history.push(`/cell/${gridCellId}/history`);
  }, [gridCellId]);

  return <></>;
}
