import AuthService from '../AuthService';

export const REQUEST_GAME = 'REQUEST_IMAGES';
export const RECEIVE_GAME = 'RECEIVE_IMAGES_RESULT';
export const TOGGLE_EDITABLE = 'TOGGLE_EDITABLE';


export function toggleEditable(){
  return {
    type: TOGGLE_EDITABLE
  };
}




let requestGame = function(){
  return {
    type: REQUEST_GAME
  };
}

let receiveGame = function(game){
  return {
    type: RECEIVE_GAME,
    game
  };
}


export const fetchGame = function(gameId, callback = ()=>{}){

  return dispatch => {

    console.log("Fetch game");
    dispatch(requestGame());

    let authService = new AuthService();

    authService.fetch('/games/' + gameId)
    .then(function(res){

      dispatch(receiveGame(res));
      callback();

    }.bind(this))
    .catch(function(err){
      console.log(err);
    });


  };

}