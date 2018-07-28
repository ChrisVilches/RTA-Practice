import { connect } from 'react-redux';
import * as nodeActions from '../actions/NodeComponent';
import NodeComponent from '../components/NodeComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    addNewChildSegment: (segments, nodeId, callback) => { dispatch(nodeActions.addNewChildSegment(segments, nodeId, callback)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeComponent);
