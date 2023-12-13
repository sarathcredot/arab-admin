import React from "react";

//Import Icons
// import Icon from "@ailibs/feather-react-ts";
import FeatherIcon from "feather-icons-react";


//constants
import { layoutTheme } from "../../../constants/layout";

interface LightDarkState {
  layoutMode: string;
  onChangeLayoutMode: any;
}

const LightDark = ({ layoutMode, onChangeLayoutMode }: LightDarkState) => {
  const mode =
    layoutMode === layoutTheme["DARKMODE"]
      ? layoutTheme["LIGHTMODE"]
      : layoutTheme["DARKMODE"];
  return (
    <div className="dropdown d-none d-sm-inline-block">
      <button
        onClick={() => onChangeLayoutMode(mode)}
        type="button"
        className="btn header-item"
      >
        {layoutMode === layoutTheme["DARKMODE"] ? (
          <FeatherIcon icon="sun" className="icon-lg layout-mode-light" />
        ) : (
          <FeatherIcon icon="moon" className="icon-lg layout-mode-dark" />
        )}
      </button>
    </div>
  );
};

export default LightDark;
