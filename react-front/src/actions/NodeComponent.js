import * as gameActions from './GameComponent';
import * as tree from '../tree';

export const ADD_NEW_CHILD_SEGMENT = 'ADD_NEW_CHILD_SEGMENT';

export const addNewChildSegment = function(segments, gameId, nodeId, name, callback = ()=>{}){

  return dispatch => {

    segments = tree.addNewChildSegment(segments, nodeId, name);
    dispatch(gameActions.updateTreeData(segments, gameId, callback));

  };

}
