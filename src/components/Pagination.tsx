import React, { Dispatch, SetStateAction } from "react";
import { Col, Row } from "reactstrap";

type Props = {
  currentPage: number;
  totalButtonsToShow: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  style?:object;
};
const Pagination = ({ currentPage, setCurrentPage, totalButtonsToShow, totalPages,style }: Props) => {
  const startPage = Math.max(0, Math.min(currentPage - 1, totalPages - totalButtonsToShow));
  const endPage = Math.min(startPage + totalButtonsToShow, totalPages);
  return (
    <Row style={{margin:0}}>
      <Col style={style}>
        <div className="d-flex justify-content-end mt-0 me-2" >
          <ul className="pagination">
            {currentPage !== 0 && (
              <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
              </li>
            )}

            {Array.from({ length: endPage - startPage }, (_, index) => {
              const pageIndex = startPage + index;
              return (
                <li
                  key={pageIndex}
                  className={`page-item ${currentPage === pageIndex ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(pageIndex)}
                  >
                    {pageIndex + 1}
                  </button>
                </li>
              );
            })}

            {currentPage < totalPages - 1 && (
              <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </button>
              </li>
            )}
          </ul>
        </div>
      </Col>
    </Row>
  );
};

export default Pagination;
