import React from 'react';

interface StatusChipProps {
    status: string | undefined;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
    const getStatusStyles = (status: string | undefined) => {
        switch (status) {
            case "NA":
                return { backgroundColor: "#cccccc", color: "#333333" };
            case "PENDING":
                return { backgroundColor: "#f0ad4e", color: "#ffffff" };
            case "PACKAGE_IN_PROGRESS":
                return { backgroundColor: "#5bc0de", color: "#ffffff" };
            case "SHIPPED":
                return { backgroundColor: "#5cb85c", color: "#ffffff" };
            case "DELIVERED":
                return { backgroundColor: "#5cb85c", color: "#ffffff" };
            case "CANCELED":
                return { backgroundColor: "#d9534f", color: "#ffffff" };
            case "APPROVED":
                return { backgroundColor: "#5bc0de", color: "#ffffff" };
            case "REJECTED":
                return { backgroundColor: "#d9534f", color: "#ffffff" };
            case "PAID":
                return { backgroundColor: "#5cb85c", color: "#ffffff" };
            default:
                return { backgroundColor: "#cccccc", color: "#333333" };
        }
    };

    const styles = getStatusStyles(status);

    return (
        <div
            style={{
                display: "inline-block",
                padding: "1px 10px",
                borderRadius: "20px",
                border: `1px solid ${styles.backgroundColor}`,
                fontWeight: 400,
                color: styles.backgroundColor,
            }}
        >
            {status || "loading..."}
        </div>
    );
};

export default StatusChip;
