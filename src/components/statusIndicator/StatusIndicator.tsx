import { capitalize } from "lodash";
import React from "react";
import { Badge } from "reactstrap";

interface StatusIndicatorProps {
  status: string | boolean | undefined;
  variant?: "chip" | "default";
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, variant = "default" }) => {
  const getStatusColor = (status: string | boolean | undefined): string => {
    switch (status) {
      case "Active":
        return "#005E2B";
      case "YES":
        return "#005E2B";
      case "Blocked":
        return "#E30613";
      case "NO":
        return "#E30613";
      case "CANCELED":
        return "#E30613";
      case "Suspended":
        return "#E30613";
      case "Pending":
        return "#f0ad4e";
      case "PENDING":
        return "#f0ad4e";
      case "SHIPPED":
        return "#F97316";
      case "IN_PROGRESS":
        return "#4947D0";
      case "Paid":
        return "#005E2B";
      case "Approved":
        return "#005E2B";
      case "UNDER_VERIFICATION":
        return "#ff9500";
      case "DELIVERED":
        return "#005E2B";
      case "COMPLETED":
        return "#005E2B";
      case "Completed":
        return "#005E2B";
      case "RETURNED TO WAREHOUSE":
        return "#005E2B";
      case "Rejected":
        return "#E30613";
      case "POSTPONED":
        return "#5a6f05";
      case "APPROVED":
        return "#005E2B";




      default:
        return "black";
    }
  };

  const getButtonStyle = (status: string | boolean): React.CSSProperties => {
    return {
      border: `1px solid ${getStatusColor(status)}`,
      color: getStatusColor(status),
      borderRadius: "10px",
      padding: "2px 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "100px",
      maxWidth: "auto",
    };
  };

  if (variant === "chip" && status) {
    return <div style={getButtonStyle(status)}>{capitalize(status?.toString())}</div>;
  }

  return (
    <p
      style={{
        background: getStatusColor(status),
        color: "#fff",
        padding: "3px 15px",
        borderRadius: 20,
        fontSize: "12px",
        margin: 0,
      }}
    >
      {status && capitalize(status.toString().replace("_", " "))}
    </p>
    // </Badge>
  );
};

export default StatusIndicator;
