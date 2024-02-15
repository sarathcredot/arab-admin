import React from "react";
import Iconify from "../iconify";
import { Button, ButtonProps as ReactstrapButtonProps } from "reactstrap";

interface ButtonProps extends ReactstrapButtonProps {
    icon: string;
    name: string;
    onClick: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ icon, name, onClick, ...rest }) => {
    return (
        <Button
            style={{
                backgroundColor: "black",
                color: "white",
                width: "auto",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                fontSize: "13px"
            }}
            onClick={onClick}
            {...rest}
        >
            <Iconify icon={icon} />
            {name}
        </Button>
    );
};

export default CustomButton;
