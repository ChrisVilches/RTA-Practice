import { REQUEST_GAME, RECEIVE_GAME, TOGGLE_EDITABLE } from '../actions/GameComponent';

const initialState = {
  editable: false,
  game: null,
  startDate: null,
  isFetchingGame: true
};

let scrapers = function(state = initialState, action) {
  switch(action.type) {

  case TOGGLE_EDITABLE:
    return { ...state, editable: !state.editable };

  case REQUEST_GAME:
    return { ...state, isFetchingGame: true };

  case RECEIVE_GAME:
    return { ...state, game: action.game, isFetchingGame: false, startDate: (new Date(action.game.createdAt)).toLocaleDateString() };

  default:
    return state;
  }
}

export default scrapers;
