import {InvoiceTypes} from "./actionTypes"

export const getInvoices = () => ({
  type: InvoiceTypes.GET_INVOICES,
})

export const getInvoicesSuccess = (invoices : any) => ({
  type: InvoiceTypes.GET_INVOICES_SUCCESS,
  payload: invoices,
})

export const getInvoicesFail = (error : any) => ({
  type: InvoiceTypes.GET_INVOICES_FAIL,
  payload: error,
})

export const getInvoiceDetail = (invoiceId : number) => ({
  type: InvoiceTypes.GET_INVOICE_DETAIL,
  invoiceId,
})

export const getInvoiceDetailSuccess = (invoices : any) => ({
  type: InvoiceTypes.GET_INVOICE_DETAIL_SUCCESS,
  payload: invoices,
})

export const getInvoiceDetailFail = (error  : any) => ({
  type: InvoiceTypes.GET_INVOICE_DETAIL_FAIL,
  payload: error,
})

export const addInvoiceDetail = (data: any) => ({
  type: InvoiceTypes.ADD_INVOICE_DETAIL,
  payload:data
})

export const addInvoicedetailSuccess = (data:any) => ({
  type: InvoiceTypes.ADD_INVOICE_DETAIL_SUCCESS,
  payload:data
})

export const addInvoicedetailFail = (error:any) => ({
  type: InvoiceTypes.ADD_INVOICE_DETAIL_FAIL,
  payload:error
})

export const invoiceDelete = (data:any) => ({
  type: InvoiceTypes.DELETE_INVOICE_DETAIL,
  payload : data
})

export const invoiceDeleteSuccess = (data: any) => ({
  type: InvoiceTypes.DELETE_INVOICE_DETAIL_SUCCESS,
  payload: data
})

export const invoiceDeleteFail = (error: any) => ({
  type: InvoiceTypes.DELETE_INVOICE_DETAIL_FAIL,
  payload: error
})

export const invoiceUpdate = (data: any) => ({
  type: InvoiceTypes.UPDATE_INVOICE_DETAIL,
  payload: data
})

export const invoiceUpdateSuccess = (data: any) => ({
  type: InvoiceTypes.UPDATE_INVOICE_DETAIL_SUCCESS,
  payload: data
})

export const invoiceUpdateFail = (error: any) => ({
  type: InvoiceTypes.UPDATE_INVOICE_DETAIL_FAIL,
  payload: error
})


