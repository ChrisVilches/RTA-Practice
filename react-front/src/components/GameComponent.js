import React, { Component } from 'react';
import NodeComponent from '../containers/NodeComponent';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Global from '../Global';
import AuthService from '../AuthService';

import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form } from 'reactstrap';
import { translate } from 'react-i18next';

import '../compiled/GameComponent.css';

import * as tree from '../tree';

import DragDropComponent from '../containers/DragDropComponent';

class GameComponent extends Component {
  constructor(){
    super();

    this.authService = new AuthService();

    this.state = { isOpen: false, modal: false, newNodeFormOpen: false, newNodeName: ''};
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setScore = this.setScore.bind(this);
    this.saveActions = this.saveActions.bind(this);
    this.modifyNode = this.modifyNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.onChangeNewNodeNameInput = this.onChangeNewNodeNameInput.bind(this);
    this.addNewNode = this.addNewNode.bind(this);
  }

  get gameId(){
    return this.props.match.params.gameId;
  }

  get game(){
    return this.props.tree.game;
  }

  addNewNode(){
    let name = this.state.newNodeName;
    this.props.addNewChildSegment(this.game.children, this.gameId, -1, name, function(){
      this.setState({
        newNodeName: '',
        newNodeFormOpen: false
      });
    }.bind(this));
  }

  onChangeNewNodeNameInput(ev){
    ev.preventDefault();
    this.setState({
      newNodeName: ev.target.value
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  }

  modifyNode(nodeId, newNode, callback = ()=>{}){

    let segments = this.game.children;

    segments = tree.updateNode(segments, nodeId, function(node){
      Object.keys(newNode).map(function(key){
        node[key] = newNode[key];
        return null;
      });
    });

    this.props.updateTreeData(segments, this.gameId, callback);
  }

  removeNode(nodeId, callback = ()=>{}){
    let segments = this.game.children;
    segments = tree.removeNode(segments, nodeId);
    this.props.updateTreeData(segments, this.gameId, callback);
  }


  saveActions(nodeId, newActionNodes, callback = () => {}){

    let treeTemp = this.game.children;

    treeTemp = tree.updateNode(treeTemp, nodeId, function(n){
      n.children = newActionNodes;
    });

    this.props.updateTreeData(treeTemp, this.gameId, callback);

  }


  setScore(scores, nodeId, actionCallback){

    let node = tree.findNode(this.game.children, nodeId);

    for(let i=0; i < node.children.length; i++){

      if(!node.children[i].hasOwnProperty('scores')){
        node.children[i]['scores'] = [];
      }

      if(typeof scores[i]){
        node.children[i].scores.push(scores[i]);
      }
    }

    this.props.updateTreeData(this.game.children, this.gameId, actionCallback);

  }



  loadGame(){

    this.props.fetchGame(this.gameId, function(){

      let image = this.game.backgroundImage;
      let title = this.game.name;

      if(image){
        document.body.style.backgroundImage = 'url(' + image + ')';
      }

      document.title = `${title} | ${Global.appName}`;
    }.bind(this));
  }



  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.match.params.gameId === this.gameId) return;
    this.loadGame();
  }

  componentDidMount(){
    this.loadGame();
  }

  componentWillUnmount(){
    Global.resetBackgroundImage();
    Global.resetTitle();
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }



  render() {

    const { t } = this.props;

    if(this.props.tree.isFetchingGame === true){
      return (
        <Col>
          <FontAwesomeIcon icon='spinner' spin/>
        </Col>
      );
    }

    return (

      <Row>
        <Col>

          <h1>{ this.game.name }</h1>
          <p className="created-at-by">{t("created-at-by", { date: this.props.tree.startDate, author: this.game.owner.username })}</p>

          <div className='toolbar'>
            <Button onClick={() => { this.props.setExpansionAll(false) }}><FontAwesomeIcon icon='folder'/> {t("game-collapse")}</Button>
            <Button onClick={() => { this.props.setExpansionAll(true) }}><FontAwesomeIcon icon='folder-open'/> {t("game-expand")}</Button>
            <Button onClick={this.toggleModal}><FontAwesomeIcon icon='chart-bar'/> {t("game-stats")}</Button>

          </div>

          <DragDropComponent
            data={this.game.children}
            parentId={-1}>{(provided, snapshot, node, i) => (
              <div key={i} ref={provided.innerRef} {...provided.draggableProps}>

              <NodeComponent
                node={node}
                modifyNode={this.modifyNode}
                parentId={-1}
                removeNode={this.removeNode}
                setScore={this.setScore}
                saveActions={this.saveActions}
                dragProperties={provided.dragHandleProps}
                lastChild={this.game.children.length === i+1}/>
            </div>
            )}</DragDropComponent>



          {this.state.newNodeFormOpen?

            <Form inline onSubmit={ev => { ev.preventDefault(); this.addNewNode(); }}>
              <Input autoFocus placeholder={t("create-enter-name")} value={this.state.newNodeName} onChange={this.onChangeNewNodeNameInput} onBlur={()=>{ if(this.state.newNodeName.length === 0){ this.setState({ newNodeFormOpen: false }) } }}></Input>
              <Button color="primary">{t("form-save")}</Button>
            </Form>
            :
            <Button onClick={()=>{ this.setState({ newNodeFormOpen: true }) }}><FontAwesomeIcon icon='plus'/></Button>
          }

        </Col>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>{t("game-stats")}</ModalHeader>
          <ModalBody>
            <p>{t("page-under-construction")}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>{t("modal-accept")}</Button>{' '}
            <Button color="secondary" onClick={this.toggleModal}>{t("modal-cancel")}</Button>
          </ModalFooter>
        </Modal>

      </Row>

    );
  }
}



export default translate('translations')(GameComponent);
