import { REQUEST_GAME, RECEIVE_GAME, SET_EXPANSION, UPDATE_TREE_FINISHED, UPDATE_TREE_LOADING } from '../actions/GameComponent';

const initialState = {
  editable: false,
  game: null,
  startDate: null,
  isFetchingGame: true,
  isUpdatingTreeData: false,
  gameId: null
};

function traversal(node, func, parent = null) {
  func(node, parent);
  if(node.hasOwnProperty('children')){
    for(let i=0; i < node.children.length; i++){
      traversal(node.children[i], func, node);
    }
  }
};

function traverseAllNodes(parentSegments, func){
  for(let i=0; i < parentSegments.length; i++){
    traversal(parentSegments[i], func);
  }
}



let treeData = function(state = initialState, action) {
  switch(action.type) {

  case UPDATE_TREE_LOADING:
    // これないとグリッチが発生する
    let game = state.game;
    game.children = action.tree;
    return { ...state, game, isUpdatingTreeData: true };

  case UPDATE_TREE_FINISHED:
    return { ...state, game: action.tree, isUpdatingTreeData: false };

  case REQUEST_GAME:
    return { ...state, isFetchingGame: true };

  case RECEIVE_GAME:
    return { ...state, game: action.game, gameId: action.game._id, isFetchingGame: false, startDate: (new Date(action.game.createdAt)).toLocaleDateString() };

  case SET_EXPANSION:

    traverseAllNodes(state.game.children, function(x){
      x.expanded = action.bool;
    });

    return { ...state };

  default:
    return state;
  }
}

export default treeData;
