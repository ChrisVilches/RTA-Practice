import React from 'react';
import PropTypes from 'prop-types';
import ActionsComponent from './ActionsComponent';
import './compiled/NodeComponent.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button, Input, Form } from 'reactstrap';
import { translate } from 'react-i18next';

class NodeComponent extends React.Component {

  constructor(){
    super();

    this.state = { latestUpdated: null, editable: false, newParentSegmentName: '', loadingAddNewBrother: false, loadingTurningIntoSingles: false, newNodeNameInput: '' };

    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.onClickAddNewBrother = this.onClickAddNewBrother.bind(this);
    this.onClickTurnSingleActions = this.onClickTurnSingleActions.bind(this);
    this.onChangeNewNodeNameInput = this.onChangeNewNodeNameInput.bind(this);
    this.modifyNode = this.modifyNode.bind(this);
    this.removeThisNode = this.removeThisNode.bind(this);
  }

  removeThisNode(){
    let newNode = this.state.node;
    newNode.removeFlag = true;
    this.props.modifyNode(this.state.node.nodeId, newNode);
  }

  onClickAddNewBrother(ev){
    ev.preventDefault();

    this.setState({ loadingAddNewBrother: true });

    this.props.addNewBrother(this.state.node.nodeId, function(){
      this.setState({ loadingAddNewBrother: false });
    }.bind(this));
  }

  modifyNode(){
    let newNode = this.state.node;
    newNode.name = this.state.newNodeNameInput;
    this.props.modifyNode(this.state.node.nodeId, newNode);
  }

  onChangeNewNodeNameInput(ev){
    ev.preventDefault();
    this.setState({
      newNodeNameInput: ev.target.value
    });
  }

  onClickTurnSingleActions(ev){
    ev.preventDefault();

    let node = this.state.node;
    node.children.map(child => delete child.children);
    this.setState({ loadingTurningIntoSingles: true });

    this.props.saveActions(node.nodeId, node.children, function(){
      this.setState({ loadingTurningIntoSingles: false });
    }.bind(this));
  }


  static getDerivedStateFromProps(nextProps, prevState){

    let newState = {};

    newState['editable'] = nextProps.editable;

    // 何もしないで
    if(prevState.latestUpdated === nextProps.latestUpdated){
      console.log("同じ", prevState.latestUpdated, nextProps.latestUpdated);

    } else {

      console.log("違う", prevState.latestUpdated, nextProps.latestUpdated);

      // 木構造が変更されたので、時間がかかる計算を再度行う。

      newState['latestUpdated'] = nextProps.latestUpdated;
      newState['node'] = nextProps.node;
      newState['newNodeNameInput'] = nextProps.node.name;
    }

    return newState;
  }

  toggleExpanded(node){
    node.expanded = !node.expanded;
    this.setState({ node });
  }

  render(){

    const { t } = this.props;

    let node = this.state.node;

    let canConvertToLeafs = false;

    if(node.hasOwnProperty('children')){
      for(let i=0; i < node.children.length; i++){
        let child = node.children[i];
        if(child.hasOwnProperty('children')){
          canConvertToLeafs = true;
          if(child.children[0].hasOwnProperty('children')){
            canConvertToLeafs = false;
            break;
          }
        }
      }
    }

    return <div>

    <div className='bullet' onClick={() => { this.toggleExpanded(node) }}>

      <span>{node.name || <i>{t("default")}</i>}</span>

      <div className='bullet-arrow-icon'>
      {(node.hasOwnProperty('children') && node.children.length > 0)? (node.expanded? <FontAwesomeIcon icon='chevron-down'/> : <FontAwesomeIcon icon='chevron-right'/>) : ''}
      </div>
    </div>

    {this.state.editable && this.state.node.expanded?
      <Form inline onSubmit={(ev) => { ev.preventDefault(); this.modifyNode(); }} className="mt-2 mb-2">
        <Button className='margin-right' color='danger' onClick={this.removeThisNode}><FontAwesomeIcon icon='times'/></Button>
        <Input placeholder={t("enter-new-name")} value={this.state.newNodeNameInput} onChange={this.onChangeNewNodeNameInput} className="margin-right"/>
        <Button color="primary" type="submit">{t("form-save")}</Button>
      </Form> : '' }


    {(this.state.editable && this.state.node.expanded && canConvertToLeafs)?

      <Button className="mb-2 mt-2" color="secondary" disabled={this.state.loadingTurningIntoSingles} onClick={this.onClickTurnSingleActions}>
        <FontAwesomeIcon icon='minus'/> {t("make-everything-into-leaf")}
      </Button>
      : ''
    }


    {
      (node.expanded && node.hasOwnProperty('children'))?

      (node.children[0].hasOwnProperty('children')?

        <ul className='segment-list'>{node.children.map(function(n, i){

          return <NodeComponent
            node={n}
            key={i}
            lastChild={node.children.length === i+1 }
            segmentQuantity={this.state.node.children.length}
            updateTreeData={this.props.updateTreeData}
            latestUpdated={this.state.latestUpdated}
            editable={this.state.editable}
            addNewBrother={this.props.addNewBrother}
            setScore={this.props.setScore}
            saveActions={this.props.saveActions}
            modifyNode={this.props.modifyNode}
            t={this.props.t}
            />
        }.bind(this)
        )
        }</ul>

        :

        <ul className='segment-list'>
          <li className='actions-container'>
            <ActionsComponent
              actions={node}
              nodeId={node.nodeId}
              latestUpdated={this.state.latestUpdated}
              saveActions={this.props.saveActions}
              setScore={this.props.setScore}
              editable={this.state.editable}/>
          </li>
        </ul>

      ) : ''

    }

    {this.state.editable && this.props.lastChild?
      <Button color="secondary" disabled={this.state.loadingAddNewBrother} onClick={this.onClickAddNewBrother}>
        <FontAwesomeIcon icon='plus'/>
      </Button>
      : ''
    }

    </div>;

  }
}


NodeComponent.propTypes = {
  updateTreeData: PropTypes.func.isRequired,
  addNewBrother: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
  saveActions: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  latestUpdated: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  lastChild: PropTypes.bool.isRequired,
  modifyNode: PropTypes.func.isRequired
};


export default translate('translations')(NodeComponent);
