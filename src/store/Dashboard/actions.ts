import {
Dashboard
} from "./actiontype";

export const getMarketoverview = (data: any) => ({
  type: Dashboard.GET_MARKET_OVERVIEW,
  payload: data,
});

export const getMarketoverviewSuccess = (actionType : any, invoices : any) => ({
  type: Dashboard.GET_MARKET_OVERVIEW_SUCCESS,
  payload: {actionType,invoices},
})

export const getMarketoverviewFail = (actionType : any, error : any) => ({
  type: Dashboard.GET_MARKET_OVERVIEW_FAIL,
  payload: {actionType,error},
})

export const getWalletBalance = (data: any) => ({
  type: Dashboard.GET_WALLENT_BALANCE,
  payload: data,
})

export const getWalletBalanceSuccess = (actionType : any, data : any) => ({
  type: Dashboard.GET_WALLENT_BALANCE_SUCCESS,
  payload: {actionType,data},
})

export const getWalletBalanceFail = (actionType : any, error : any) => ({
  type: Dashboard.GET_WALLENT_BALANCE_FAIL,
  payload: {actionType,error},
})

export const getInvestedOverview = (data: any) => ({
  type: Dashboard.GET_Invested_Overview,
  payload: data,
})

export const getInvestedOverviewSuccess = (actionType : any, data : any) => ({
type: Dashboard.GET_Invested_Overview_SUCCESS,
  payload: {actionType,data}
})

export const getInvestedOverviewFail = (actionType : any, error : any) => ({
  type: Dashboard.GET_Invested_Overview_FAIL,
  payload: {actionType,error},
})