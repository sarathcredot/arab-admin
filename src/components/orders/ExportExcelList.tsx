import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Col,
    Popover,
    PopoverBody,
    PopoverHeader,
    Row,
    Table
} from "reactstrap";

import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "../Common/Loader";
import Iconify from "../iconify/Iconify";
import { useSearchParams } from "react-router-dom";

interface Record {
    _id: string;
    name: string;
    status: string;
    isExpired: boolean;
    createdAt: string;
}


function ExportExcelList({ name }: any) {
    const [searchParams] = useSearchParams();
    const vendorId = searchParams.get("vendorId")

    const [exportListOpen, setExportListOpen] = useState(false);
    const toggleExportList = () => setExportListOpen(!exportListOpen);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 3;
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const totalPages = Math.ceil(maxRecords / pageSize);
    const [jobsQueueList, setJobsQueueList] = useState<Record[]>([]);
    const popoverRef = useRef<HTMLDivElement>(null);

    const GET_JOBS_QUEUE = gql`
 query GetJobsQueue($input: GetJobQueueInput!) {
  getJobsQueue(input: $input) {
    records {
      _id
      name
      status
      isExpired
      createdAt
    }
    maxRecords
  }
}`

    const { data: jobsQueueData, refetch: jobsQueueRefetch, loading: jobsQueueLoading } = useQuery(GET_JOBS_QUEUE, {
        variables: {
            input: {
                page: currentPage,
                size: pageSize,
                name: name,
                ...(vendorId && { vendorId })
            }
        }
    });

    const fetchData = async () => {
        try {
            const result = await jobsQueueRefetch({
                input: {
                    page: currentPage,
                    size: pageSize,
                    name: name,
                    ...(vendorId && { vendorId })
                }
            });
            setJobsQueueList(result.data.getJobsQueue.records);
            setMaxRecords(result.data.getJobsQueue.maxRecords);
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [jobsQueueData, jobsQueueRefetch, currentPage])

    const GET_DOWNLOAD_LINK = gql`
    query GetAdminDownloadToken($input: GetAdminDownloadTokenInput!) {
        getAdminDownloadToken(input: $input) {
         url
        }
    }
     `

    const { data: downloadLinkData, refetch: downloadLinkRefetch } = useQuery(GET_DOWNLOAD_LINK, {
        variables: {
            input: {
                _id: ""
            }
        }
    });


    const handleFileDownloadClick = async (id: string) => {
        try {
            const result = await downloadLinkRefetch({
                input: {
                    _id: id
                }
            });
            const downloadUrl = result.data.getAdminDownloadToken.url;
            const link = document.createElement('a');
            link.href = downloadUrl;

            link.setAttribute('download', 'ORDERS-' + Date.now() + '.xlsx');

            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.log(error);
        }
    }


    const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setExportListOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div>
            <CustomButton bgColor={"#1D6F42"} id="Popover1" type="button" onClick={toggleExportList} icon="file-icons:microsoft-excel" name="List" />

            <Popover
                style={{ width: "500px" }}
                placement="left"
                isOpen={exportListOpen}
                target="Popover1"
                toggle={toggleExportList}
                innerRef={popoverRef}
            >
                <PopoverHeader>Export List</PopoverHeader>
                <PopoverBody >
                    {

                        jobsQueueLoading ?
                            <Loader />
                            :
                            <Table bordered width={"500px"}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>
                                            <CustomButton onClick={() => fetchData()}
                                                iconWidth={15} icon="mingcute:refresh-3-line" name="reload"
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    width: "auto",
                                                    height: "30px",
                                                    borderRadius: "10px",
                                                    gap: "5px",
                                                    fontSize: "12px"
                                                }}
                                            />

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobsQueueList.map((item, index) => (
                                        <tr key={index}>
                                            <td>{currentPage * pageSize + index + 1}</td>
                                            <td>
                                                <div>
                                                    <p style={{ margin: "0px" }}>{moment(item.createdAt).format("ll")}</p>
                                                    <p style={{ margin: "0px" }}>{moment(item.createdAt).format("LT")}</p>
                                                </div>
                                            </td>
                                            <td>{item.status}</td>
                                            <td>
                                                <Button onClick={() => handleFileDownloadClick(item._id)} color="primary" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Iconify icon="material-symbols:download-sharp" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                    }

                                </tbody>
                            </Table>

                    }
                </PopoverBody>

                <Row>
                    <Col>
                        <div className="d-flex justify-content-end mt-0 me-3">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 0}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {currentPage > 2 && (
                                    <>
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => setCurrentPage(0)}>1</button>
                                        </li>
                                        {currentPage > 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                    </>
                                )}

                                {Array.from({ length: totalPages }, (_, index) => index)
                                    .filter(index => index >= currentPage - 2 && index <= currentPage + 2)
                                    .map(index => (
                                        <li key={index} className={`page-item ${currentPage === index ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(index)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}

                                {currentPage < totalPages - 3 && (
                                    <>
                                        {currentPage < totalPages - 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => setCurrentPage(totalPages - 1)}>{totalPages}</button>
                                        </li>
                                    </>
                                )}

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

            </Popover>

        </div>
    )
}

export default ExportExcelList