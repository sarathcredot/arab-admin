import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { InvoiceTypes } from "./actionTypes"
import {
  getInvoicesSuccess,
  getInvoicesFail,
  getInvoiceDetailSuccess,
  getInvoiceDetailFail,
  addInvoicedetailSuccess,
  addInvoicedetailFail,
  invoiceDeleteSuccess,
  invoiceDeleteFail,
  invoiceUpdateSuccess,
  invoiceUpdateFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getInvoices, getInvoiceDetail, addInvoice, deleteInvoice, updateInvoice } from "../../helpers/fakebackend_helper"

function* fetchInvoices() {
  try {
    const response: Promise<any> = yield call(getInvoices)
    yield put(getInvoicesSuccess(response))
  } catch (error) {
    yield put(getInvoicesFail(error))
  }
}

function* fetchInvoiceDetail({ invoiceId }: any) {
  try {
    const response: Promise<any> = yield call(getInvoiceDetail, invoiceId)
    yield put(getInvoiceDetailSuccess(response))
  } catch (error) {
    yield put(getInvoiceDetailFail(error))
  }
}

function* addInvoiceDetail({ payload: user }: any) {
  try {
    const response: Promise<any> = yield call(addInvoice, user)

    yield put(addInvoicedetailSuccess(response))
  } catch (error) {

    yield put(addInvoicedetailFail(error))
  }
}

function* onDeleteInvoice({ payload: data }:any) {
  try {
    const response: Promise<any> = yield call(deleteInvoice, data);
    yield put(invoiceDeleteSuccess(response));
  } catch (error) {
    yield put(invoiceDeleteFail(error));
  }
}

function* onUpdateinvoice({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(updateInvoice, data);
    yield put(invoiceUpdateSuccess(response));
  } catch (error) {
    yield put(invoiceUpdateFail(error));
  }
}


function* invoiceSaga() {
  yield takeEvery(InvoiceTypes.GET_INVOICES, fetchInvoices)
  yield takeEvery(InvoiceTypes.GET_INVOICE_DETAIL, fetchInvoiceDetail)
  yield takeEvery(InvoiceTypes.ADD_INVOICE_DETAIL, addInvoiceDetail)
  yield takeEvery(InvoiceTypes.DELETE_INVOICE_DETAIL, onDeleteInvoice)
  yield takeEvery(InvoiceTypes.UPDATE_INVOICE_DETAIL, onUpdateinvoice)
}

export default invoiceSaga
