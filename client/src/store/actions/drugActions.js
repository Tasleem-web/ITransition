import { USER_SERVER } from "../../config";
import { FETCH_DATA_CONFIG_FAILURE, FETCH_DATA_CONFIG_SUCCESS, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS, FETCH_DRUG, FETCH_DRUG_CONFIG, UPDATE_CONFIG_VISIBILITY_SUCCESS, UPDATE_DRUG_ORDER_SUCCESS } from "../constants";

import axios from 'axios';

export const fetchDrugAction = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_DRUG });
    try {
      const response = await axios.get(`${USER_SERVER}/drugs/getAllDrugs`)
      dispatch({ type: FETCH_DATA_SUCCESS, payload: response.data.data });
    } catch (error) {
      dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
    }
  };
};

export const fetchDrugConfigAction = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_DRUG_CONFIG });
    try {
      const response = await axios.get(`${USER_SERVER}/drug-config`)
      dispatch({ type: FETCH_DATA_CONFIG_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_DATA_CONFIG_FAILURE, payload: error.message });
    }
  };
};

export const updateColumnOrderAction = (newConfig) => {
  return async (dispatch) => {
    try {

      const response = await axios.put(`${USER_SERVER}/drug-config`, newConfig);

      dispatch({
        type: UPDATE_DRUG_ORDER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error('API Error:', error);
    }
  };
};
