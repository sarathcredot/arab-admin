import PropTypes from 'prop-types';
import React, { forwardRef, Ref } from 'react';
// icons
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

interface IconifyProps {
    style?: React.CSSProperties;
    width?: number | string;
    icon?: string;
}

const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
    function Iconify({ icon, width = 20, style, ...other }, ref) {
        return (
            <div
                ref={ref}
                // style={{ width, height: width, ...style }}
                {...other}
            >
                {icon && <Icon icon={icon} style={{ width, height: width, ...style }} />}
            </div>
        );
    }
);


Iconify.propTypes = {
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
};

export default Iconify;
