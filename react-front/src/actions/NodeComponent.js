import * as gameActions from './GameComponent';
import * as tree from '../tree';

export const addNewChildSegment = function(segments, gameId, nodeId, name, callback = ()=>{}){

  return dispatch => {

    segments = tree.addNewChildSegment(segments, nodeId, name);
    dispatch(gameActions.updateTreeData(segments, gameId, callback));

  };

}


export const removeNode = function(segments, gameId, nodeId, callback = ()=>{}){

  return dispatch => {

    let newSegments = tree.removeNode(segments, nodeId);
    dispatch(gameActions.updateTreeData(newSegments, gameId, callback));
  };

}
