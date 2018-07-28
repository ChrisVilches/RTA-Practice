import AuthService from '../AuthService';

export const REQUEST_GAME = 'REQUEST_GAME';
export const RECEIVE_GAME = 'RECEIVE_GAME';
export const SET_EXPANSION = 'SET_EXPANSION';
export const UPDATE_TREE_LOADING = 'UPDATE_TREE_LOADING';
export const UPDATE_TREE_FINISHED = 'UPDATE_TREE_FINISHED';

let authService = new AuthService();


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

export const updateTree = function(tree){
  return {
    type: UPDATE_TREE_LOADING,
    tree
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

    dispatch(updateTree(treeData));

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
