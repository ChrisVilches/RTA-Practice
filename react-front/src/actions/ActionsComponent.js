import * as gameActions from './GameComponent';
import * as tree from '../tree';

export const addNewAction = function(segments, gameId, parentId, callback = ()=>{}){

  return dispatch => {

    let newSegments = tree.addNewChildSegment(segments, parentId);
    dispatch(gameActions.updateTreeData(newSegments, gameId, callback));

  };

}


export const deleteAction = function(segments, gameId, nodeId, callback = ()=>{}){

  return dispatch => {

    let newSegments = tree.removeNode(segments, nodeId);
    dispatch(gameActions.updateTreeData(newSegments, gameId, callback));
  };

}


export const updateActionName = function(segments, gameId, nodeId, name, callback = ()=>{}){

  return dispatch => {

    let newSegments = tree.updateNode(segments, nodeId, x => x.name = name);
    dispatch(gameActions.updateTreeData(newSegments, gameId, callback));

  };

}
