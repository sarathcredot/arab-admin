import React from 'react'
import { Spinner } from 'reactstrap'

function Loader() {
    return (
        <div style={{ height: '200px', display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Spinner color="primary" />
        </div>
    )
}

export default Loader