import AuthService from '../AuthService';

export const REQUEST_GAME = 'REQUEST_GAME';
export const RECEIVE_GAME = 'RECEIVE_GAME';
export const TOGGLE_EDITABLE = 'TOGGLE_EDITABLE';
export const SET_EXPANSION = 'SET_EXPANSION';
export const UPDATE_TREE_LOADING = 'UPDATE_TREE_LOADING';
export const UPDATE_TREE_FINISHED = 'UPDATE_TREE_FINISHED';

let authService = new AuthService();

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


export const setExpansionAll = function(bool){
  return {
    type: SET_EXPANSION,
    bool
  }
}

export const updateTree = function(){
  return {
    type: UPDATE_TREE_LOADING
  };
}

export const updateTreeFinished = function(tree){
  return {
    type: UPDATE_TREE_FINISHED,
    tree
  };
}


export const updateTreeData = function(treeData, gameId, actionCallback = () => {}){

  return dispatch => {

    dispatch(updateTree());

    authService.fetch('/games/' + gameId, {
      method: 'PUT',
      body: JSON.stringify({
        children: treeData
      })
    })
    .then(function(response){

      dispatch(updateTreeFinished(response));
      actionCallback();

    })
    .catch(function(err){
      console.log(err);
    });

  };
}


export const fetchGame = function(gameId, callback = ()=>{}){

  return dispatch => {

    console.log("Fetch game");
    dispatch(requestGame());

    authService.fetch('/games/' + gameId)
    .then(function(res){

      dispatch(receiveGame(res));
      callback();

    })
    .catch(function(err){
      console.log(err);
    });


  };

}
