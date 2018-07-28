import { connect } from 'react-redux';
import * as nodeActions from '../actions/NodeComponent';
import NodeComponent from '../components/NodeComponent';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {

  return {
    addNewChildSegment: (segments, nodeId, name, callback) => { dispatch(nodeActions.addNewChildSegment(segments, nodeId, name, callback)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeComponent);
