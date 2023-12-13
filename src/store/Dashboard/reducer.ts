import {Dashboard} from "./actiontype"

const INIT_STATE = {
  Marketoverview: [],
  error: {},
  WallentBalanceData: [],
  InvestedData: [],
}

const dashboard = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case Dashboard.GET_MARKET_OVERVIEW_SUCCESS:
      return {
        ...state,
        Marketoverview: action.payload,
      }

    case Dashboard.GET_MARKET_OVERVIEW_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    
    case Dashboard.GET_WALLENT_BALANCE_SUCCESS:
      return {
        ...state,
        WallentBalanceData: action.payload,
      }
    
    case Dashboard.GET_MARKET_OVERVIEW_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    
    case Dashboard.GET_Invested_Overview_SUCCESS:
      return {
        ...state,
        InvestedData: action.payload,
      }
    
    case Dashboard.GET_Invested_Overview_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default dashboard
