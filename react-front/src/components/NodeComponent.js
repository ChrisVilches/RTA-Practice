import React from 'react';
import PropTypes from 'prop-types';
import ActionsComponent from '../containers/ActionsComponent';
import '../compiled/NodeComponent.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Input, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { translate } from 'react-i18next';
import Global from '../Global';
import * as NodeComponentContainer from '../containers/NodeComponent';


class NodeComponent extends React.Component {

  constructor(){
    super();

    this.state = {
      newParentSegmentName: '',
      loadingTurningIntoSingles: false,
      newNodeNameInput: '',
      saveTimeout: null,
      savedMessageTimeout: null,
      dropdownOpen: false
    };

    this.actionsComponent = React.createRef();

    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.addNewChildSegment = this.addNewChildSegment.bind(this);
    this.onClickTurnSingleActions = this.onClickTurnSingleActions.bind(this);
    this.onChangeNewNodeNameInput = this.onChangeNewNodeNameInput.bind(this);
    this.modifyNode = this.modifyNode.bind(this);
    this.removeThisNode = this.removeThisNode.bind(this);
    this.dispatchSaveTimeout = this.dispatchSaveTimeout.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
  }

  dropdownToggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  dispatchSaveTimeout(){

    clearTimeout(this.state.savedMessageTimeout);

    if(this.state.saveTimeout !== null){
      clearTimeout(this.state.saveTimeout);
    }

    this.setState({
      savedMessageTimeout: null,
      saveTimeout: setTimeout(this.modifyNode, Global.saveDelayTime)
    });

  }

  removeThisNode(){
    let newNode = this.state.node;
    newNode.removeFlag = true;
    this.props.modifyNode(this.state.node.nodeId, newNode);
  }

  addNewChildSegment(){
    this.props.addNewChildSegment(this.state.node.nodeId);
  }

  modifyNode(){

    clearTimeout(this.state.saveTimeout);
    this.setState({
      saveTimeout: null
    });

    let newNode = this.state.node;
    newNode.name = this.state.newNodeNameInput;
    this.props.modifyNode(this.state.node.nodeId, newNode, function(){

      this.setState({
        savedMessageTimeout: setTimeout(function(){
          this.setState({
            savedMessageTimeout: null
          });
        }.bind(this), 1500)
      });

    }.bind(this));
  }

  onChangeNewNodeNameInput(ev){
    ev.preventDefault();
    this.setState({
      newNodeNameInput: ev.target.value
    });

    this.dispatchSaveTimeout();
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

    // 何もしないで
    if(prevState.latestUpdated === nextProps.tree.game.updatedAt){
      console.log("同じ", prevState.latestUpdated, nextProps.tree.game.updatedAt);

    } else {

      console.log("違う", prevState.latestUpdated, nextProps.tree.game.updatedAt);

      // 木構造が変更されたので、時間がかかる計算を再度行う。

      newState['latestUpdated'] = nextProps.tree.game.updatedAt;
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

    let hasFolders = node.hasOwnProperty('children') && node.children[0].hasOwnProperty('children');

    return <div>

      <div className='bullet' onClick={() => { this.toggleExpanded(node) }}>

        <span>{node.name || <i>{t("default")}</i>}</span>

        <div className='bullet-arrow-icon'>
        {(node.hasOwnProperty('children') && node.children.length > 0)? (node.expanded? <FontAwesomeIcon icon='chevron-down'/> : <FontAwesomeIcon icon='chevron-right'/>) : ''}
        </div>
      </div>

      {this.props.tree.editable && this.state.node.expanded?
        <Form inline onSubmit={(ev) => { ev.preventDefault(); this.modifyNode(); }} className="mt-2 mb-2">
          <Input placeholder={t("enter-new-name")} value={this.state.newNodeNameInput} onChange={this.onChangeNewNodeNameInput} className="margin-right"/>


          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle}>
            <DropdownToggle caret></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.removeThisNode}>{t("remove-node")}</DropdownItem>

              {hasFolders?
                <DropdownItem onClick={this.addNewChildSegment}>{t("add-segment")}</DropdownItem> :
                <DropdownItem onClick={this.actionsComponent.addNewAction}>{t("add-action")}</DropdownItem>
              }
              {canConvertToLeafs? <DropdownItem onClick={this.onClickTurnSingleActions}>{t("make-everything-into-leaf")}</DropdownItem> : ''}
              {!hasFolders? <DropdownItem onClick={this.actionsComponent.turnAllIntoFolders}>{t("make-everything-into-folder")}</DropdownItem> : ''}

            </DropdownMenu>
          </Dropdown>

          {this.state.saveTimeout === null? '' : <FontAwesomeIcon icon='spinner' spin/>}
          {this.state.savedMessageTimeout === null? '' : <span><FontAwesomeIcon icon='check'/></span>}


        </Form> : '' }



      {
        (node.expanded && node.hasOwnProperty('children'))?

        (hasFolders?

          <ul className='segment-list'>{node.children.map(function(n, i){

            return <NodeComponentContainer.default
              node={n}
              key={i}
              lastChild={node.children.length === i+1 }
              segmentQuantity={this.state.node.children.length}
              updateTreeData={this.props.updateTreeData}
              addNewChildSegment={this.props.addNewChildSegment}
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
                saveActions={this.props.saveActions}
                setScore={this.props.setScore}
                onRef={a => this.actionsComponent = a}/>
            </li>
          </ul>

        ) : ''

      }

    </div>;

  }
}


NodeComponent.propTypes = {
  updateTreeData: PropTypes.func.isRequired,
  addNewChildSegment: PropTypes.func.isRequired,
  setScore: PropTypes.func.isRequired,
  saveActions: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  lastChild: PropTypes.bool.isRequired,
  modifyNode: PropTypes.func.isRequired
};


export default translate('translations')(NodeComponent);
