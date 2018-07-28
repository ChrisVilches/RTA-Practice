import { REQUEST_SCRAPERS, REQUEST_SCRAPERS_RESULT, TOGGLE_EDITABLE } from '../actions/GameComponent';

const initialState = {
  editable: false,
  isFetching: false,
  scrapers: []
};

let scrapers = function(state = initialState, action) {
  switch(action.type) {

  case TOGGLE_EDITABLE:
    return { ...state, editable: !state.editable };    

  case REQUEST_SCRAPERS:
    return { ...state, isFetching: true };

  case REQUEST_SCRAPERS_RESULT:
    return { ...state, scrapers: action.scrapers, isFetching: false };

  default:
    return state;
  }
}

export default scrapers;
