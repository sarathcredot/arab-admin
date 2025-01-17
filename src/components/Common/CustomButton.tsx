import React from "react";
import Iconify from "../iconify";
import { Button, ButtonProps as ReactstrapButtonProps } from "reactstrap";

interface ButtonProps extends ReactstrapButtonProps {
  icon?: string;
  name: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  bgColor="#000",
  icon,
  width,
  color,
  iconWidth = 20,
  name,
  ...rest
}) => {
  return (
    <Button
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        color: color ? color : "white",
        width: width ? width : "auto",
        height: "40px",
        borderRadius: "10px",
        gap: "5px",
        fontSize: "13px",
        border: "none",
        outlineColor:"red"
      }}
      {...rest}
    >
      <Iconify
        icon={icon}
        width={iconWidth}
      />
      {name}
    </Button>
  );
};

export default CustomButton;
