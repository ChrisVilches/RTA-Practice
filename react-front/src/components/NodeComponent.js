import React from 'react';
import PropTypes from 'prop-types';
import ActionsComponent from '../containers/ActionsComponent';
import '../compiled/NodeComponent.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Button, Input, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { translate } from 'react-i18next';
import * as NodeComponentContainer from '../containers/NodeComponent';
import classNames from 'classnames';
import DragDropComponent from '../containers/DragDropComponent';

class NodeComponent extends React.Component {

  constructor(){
    super();

    this.state = {
      modal: false,
      loadingTurningIntoSingles: false,
      newNodeNameInput: null,
      dropdownOpen: false,
      editingName: false
    };

    this.actionsComponent = React.createRef();

    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.onClickTurnSingleActions = this.onClickTurnSingleActions.bind(this);
    this.onChangeNewNodeNameInput = this.onChangeNewNodeNameInput.bind(this);
    this.modifyNode = this.modifyNode.bind(this);
    this.removeThisNode = this.removeThisNode.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.renameNode = this.renameNode.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  get gameId(){
    return this.game._id;
  }

  get game(){
    return this.props.tree.game;
  }

  toggleModal(){
    this.setState({
      modal: !this.state.modal
    });
  }

  renameNode(){
    this.toggleModal();
  }

  dropdownToggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  removeThisNode(){
    this.props.removeNode(this.state.node.nodeId);
  }


  modifyNode(){
    let newNode = this.state.node;
    newNode.name = this.state.newNodeNameInput;
    this.props.modifyNode(this.state.node.nodeId, newNode);
    this.setState({
      editingName: false
    });
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

    // 何もしないで
    if(prevState.updatedAt === nextProps.tree.game.updatedAt){
      console.log("同じ", prevState.updatedAt, nextProps.tree.game.updatedAt);

    } else {

      console.log("違う", prevState.updatedAt, nextProps.tree.game.updatedAt);

      // 木構造が変更されたので、時間がかかる計算を再度行う。

      newState['updatedAt'] = nextProps.tree.game.updatedAt;
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

    let dropDownMenu = <Dropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle} style={{display:'inline'}}>
      <DropdownToggle className="node-toolbar-btn" color="link"><FontAwesomeIcon icon='ellipsis-v'/></DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={this.removeThisNode}>
          <span className="dropdown-item-icon"><FontAwesomeIcon icon='times'/></span>
          {t("remove-node")}
        </DropdownItem>

        {hasFolders?
          <DropdownItem onClick={() => { this.props.addNewChildSegment(this.game.children, this.gameId, this.state.node.nodeId) }}>
            <span className="dropdown-item-icon"><FontAwesomeIcon icon='plus' className="dropdown-item-icon"/></span>
            {t("add-segment")}
            </DropdownItem> :
          <DropdownItem onClick={this.actionsComponent.addNewAction}>
            <span className="dropdown-item-icon"><FontAwesomeIcon icon='plus' className="dropdown-item-icon"/></span>
            {t("add-action")}
          </DropdownItem>
        }
        {canConvertToLeafs? <DropdownItem onClick={this.onClickTurnSingleActions}>
        <span className="dropdown-item-icon"><FontAwesomeIcon icon='leaf' className="dropdown-item-icon"/></span>
        {t("make-everything-into-leaf")}
        </DropdownItem> : ''}
        {!hasFolders? <DropdownItem onClick={this.actionsComponent.turnAllIntoFolders}>
        <span className="dropdown-item-icon"><FontAwesomeIcon icon='folder' className="dropdown-item-icon"/></span>
        {t("make-everything-into-folder")}
      </DropdownItem> : ''}

      </DropdownMenu>
    </Dropdown>;

    return <div>

      <div className='bullet'>

        {dropDownMenu}

        <span className='node-toolbar-btn' color="" {...this.props.dragProperties}><FontAwesomeIcon icon='arrows-alt'/></span>


        {this.state.editingName?
          <Form inline onSubmit={(ev) => { ev.preventDefault(); this.modifyNode(); }} style={{ display:'inline' }}>
            <Input placeholder={t("enter-new-name")} value={this.state.newNodeNameInput} onChange={this.onChangeNewNodeNameInput} onBlur={this.modifyNode} autoFocus/>
          </Form>
          :
          <span onClick={()=>{ this.setState({ editingName: true }) }}>{node.name || <i>{t("default")}</i>}</span>

        }

        <Button className='node-toolbar-btn margin-left-btn' color="link" onClick={() => { this.toggleExpanded(node) }}>
        {(node.hasOwnProperty('children') && node.children.length > 0)? (node.expanded? <FontAwesomeIcon icon='chevron-down'/> : <FontAwesomeIcon icon='chevron-right'/>) : ''}
        </Button>

      </div>



      {/*this.props.tree.editable && this.state.node.expanded?
        <Form inline onSubmit={(ev) => { ev.preventDefault(); this.modifyNode(); }} className="mt-2 mb-2">
          <Input placeholder={t("enter-new-name")} value={this.state.newNodeNameInput} onChange={this.onChangeNewNodeNameInput} onBlur={this.modifyNode} className="margin-right"/>


          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle}>
            <DropdownToggle caret></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.removeThisNode}>{t("remove-node")}</DropdownItem>

              {hasFolders?
                <DropdownItem onClick={() => { this.props.addNewChildSegment(this.game.children, this.gameId, this.state.node.nodeId) }}>{t("add-segment")}</DropdownItem> :
                <DropdownItem onClick={this.actionsComponent.addNewAction}>{t("add-action")}</DropdownItem>
              }
              {canConvertToLeafs? <DropdownItem onClick={this.onClickTurnSingleActions}>{t("make-everything-into-leaf")}</DropdownItem> : ''}
              {!hasFolders? <DropdownItem onClick={this.actionsComponent.turnAllIntoFolders}>{t("make-everything-into-folder")}</DropdownItem> : ''}

            </DropdownMenu>
          </Dropdown>

        </Form> : '' */}



      {
        node.hasOwnProperty('children')?

        <div className={classNames({ 'collapsed': !node.expanded })}>



          {hasFolders?

            <ul className='segment-list'>


              <DragDropComponent
                data={node.children}
                parentId={node.nodeId}
                updateTreeData={this.props.updateTreeData}>{(provided, snapshot, n, i) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>

                    <NodeComponentContainer.default
                      node={n}
                      key={i}
                      parentId={node.nodeId}
                      lastChild={node.children.length === i+1 }
                      setScore={this.props.setScore}
                      dragProperties={provided.dragHandleProps}
                      saveActions={this.props.saveActions}
                      modifyNode={this.props.modifyNode}
                      removeNode={this.props.removeNode}
                      t={this.props.t}
                      />
                </div>
                )}</DragDropComponent>



              {/*node.children.map(function(n, i){

              return <NodeComponentContainer.default
                node={n}
                key={i}
                parentId={node.nodeId}
                lastChild={node.children.length === i+1 }
                setScore={this.props.setScore}
                saveActions={this.props.saveActions}
                modifyNode={this.props.modifyNode}
                removeNode={this.props.removeNode}
                t={this.props.t}
                />
            }.bind(this)
            )
            */}</ul>

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

          }

        </div> : ''

      }

      {/*<Modal isOpen={this.state.modal} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>{t("rename-node")}</ModalHeader>
        <ModalBody>
          <Form inline onSubmit={(ev) => { ev.preventDefault(); this.modifyNode(); }} className="mt-2 mb-2">
            <Input placeholder={t("enter-new-name")} value={this.state.newNodeNameInput} onChange={this.onChangeNewNodeNameInput} className="margin-right"/>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={() => { this.modifyNode(); this.toggleModal(); }}>{t("modal-accept")}</Button>{' '}
          <Button color="secondary" onClick={this.toggleModal}>{t("modal-cancel")}</Button>
        </ModalFooter>
      </Modal>*/}

    </div>;

  }
}


NodeComponent.propTypes = {
  setScore: PropTypes.func.isRequired,
  parentId: PropTypes.number.isRequired,
  saveActions: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  lastChild: PropTypes.bool.isRequired,
  modifyNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired
};


export default translate('translations')(NodeComponent);
