
import {
  FETCH_DATA_CONFIG_SUCCESS,
  FETCH_DATA_SUCCESS,
  UPDATE_COLUMN_ORDER_SUCCESS,
  UPDATE_CONFIG_SUCCESS,
  UPDATE_DRUG_ORDER_SUCCESS
} from "../constants"

const initialState = {
  list: [],
  total: 0,
  page: 1,
  totalPages: 0,
  config: []
};

// reducer
const drugReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        list: action.payload,
      };
    case FETCH_DATA_CONFIG_SUCCESS:
      return {
        ...state,
        config: action.payload.sort((a, b) => a.order - b.order),
      };
    case UPDATE_COLUMN_ORDER_SUCCESS:
      return {
        ...state,
        config: action.payload.sort((a, b) => a.order - b.order),
      };

    case UPDATE_DRUG_ORDER_SUCCESS:
      return {
        ...state,
        config: action.payload.sort((a, b) => a.order - b.order),
      };
    default:
      return state;
  }
};

export default drugReducer;