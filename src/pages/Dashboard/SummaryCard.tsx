import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
// utils
// components
import Iconify from 'src/components/iconify/Iconify';
import { formatCurrency } from 'src/utils/formatCurrency';

interface SummaryCardProps {
    color?: string;
    icon: string;
    title: string;
    total: number;
    sx?: React.CSSProperties;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, total, icon, color = 'primary', sx, ...other }) => {
    return (
        <Card
            body
            style={{
                padding: '20px',
                textAlign: 'center',
                color: 'primary',
                backgroundColor: 'white',
                boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.1)",
                ...sx,
            }}
            {...other}
        >
            <div
                style={{
                    margin: 'auto',
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    width: '54px',
                    height: '54px',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    color: 'rgba(227, 6, 19, 1)',
                    background: " rgba(227, 6, 19, 0.1)"

                }}
            >
                <Iconify icon={icon} width={22} />
            </div>

            <h3 style={{
                "fontWeight": "600",
                "fontSize": "25px",
                "lineHeight": "27px",
                "color": "#2F2F2F"
            }}>{total}</h3>

            <p style={{
                "fontWeight": "500",
                "fontSize": "14px",
                "lineHeight": "27px",
                "color": "#000000"
            }}>{title}</p>
        </Card>
    );
};

SummaryCard.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    sx: PropTypes.object,
};

export default SummaryCard;
