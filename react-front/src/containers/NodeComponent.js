import { connect } from 'react-redux';
import * as nodeActions from '../actions/NodeComponent';
import NodeComponent from '../components/NodeComponent';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => {
  return state;
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(nodeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeComponent);
