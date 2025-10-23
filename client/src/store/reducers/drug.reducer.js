
import { FETCH_DATA_CONFIG_SUCCESS, FETCH_DATA_SUCCESS } from "../constants"

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
        config: action.payload,
      };
    default:
      return state;
  }
};

export default drugReducer;

// const initialState = {
//   drug: {
//     list: [],
//     total: 0,
//     page: 1,
//     totalPages: 0,
//   },
//   drugConfig: {
//     list: []
//   },
// }

// // reducer
// const drugReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case FETCH_DATA_SUCCESS:
//       return {
//         ...state,
//         drug: {
//           ...state.drug,
//           list: { ...state.drug, ...action.payload },
//         }
//       };
//     case FETCH_DRUG_CONFIG:
//       return {
//         ...state,
//         drugConfig: {
//           ...state.drugConfig,
//           ...action.payload,
//         }
//       };
//     default:
//       return state;
//   }
// };