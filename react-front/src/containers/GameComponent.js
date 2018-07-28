import { connect } from 'react-redux';
import * as gameActions from '../actions/GameComponent';
import * as nodeActions from '../actions/NodeComponent';
import GameComponent from '../components/GameComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    fetchGame: (gameId, callback) => { dispatch(gameActions.fetchGame(gameId, callback)) },
    toggleEditable: () => { dispatch(gameActions.toggleEditable()) },
    setExpansionAll: bool => { dispatch(gameActions.setExpansionAll(bool)) },
    updateTreeData: (segments, gameId, callback) => { dispatch(gameActions.updateTreeData(segments, gameId, callback)) },
    addNewChildSegment: (segments, gameId, nodeId, callback) => { dispatch(nodeActions.addNewChildSegment(segments, gameId, nodeId, callback)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameComponent);
