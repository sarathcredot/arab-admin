import React from "react";
import { Container } from "reactstrap";

export default function PageNotFound() {
    return (
        <div className="page-content">
            <Container fluid={true}>
                <section className="http-error" style={{ textAlign: "center", padding: "3rem 0" }}>
                    <div style={{ maxWidth: "50rem", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <h2 style={{ fontSize: "4rem", margin: "0", color: "#333" }}>404<i className="fas fa-file" style={{ marginLeft: "0.5rem" }}></i></h2>
                            <p style={{ fontSize: "1rem", color: "#666", marginTop: "1rem" }}>We're sorry, but the page you were looking for doesn't exist.</p>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    )
}
