import React from 'react';

const Id = (cell: any) => {
  return cell.value ? cell.value : '';
};

const InvoiceId = (cell: any) => {
  return (
    <a className="text-dark fw-medium">{cell.value}</a>
  );
};

const Date = (cell: any) => {
  return cell.value ? cell.value : '';
};

const BillingName = (cell: any) => {
  return cell.value ? cell.value : '';
};

const Amount = (cell: any) => {
  return cell.value ? cell.value : '';
};

const DownloadPdf = (cell: any) => {
  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-soft-light btn-sm w-xs waves-effect btn-label waves-light"
        >
          <i className="bx bx-download label-icon"></i> Pdf
        </button>
      </div>
    </>
  );
};

export {
  Id,
  InvoiceId,
  Date,
  BillingName,
  Amount,
  DownloadPdf
};