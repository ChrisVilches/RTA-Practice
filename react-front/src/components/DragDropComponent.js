import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as tree from '../tree';

class DragDropComponent extends React.Component {

  constructor(){
    super();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result, a) {

    // dropped outside the list
    if(!result.destination){
      return;
    }

    let parent = Number(result.destination.droppableId);
    let swapIndex1 = result.destination.index;
    let swapIndex2 = result.source.index;

    let swap = function(array, i, j){
      let [removed] = array.splice(j, 1);
      array.splice(i, 0, removed);
    }

    if(parent === -1){
      swap(this.props.tree.game.children, swapIndex1, swapIndex2);
      this.props.updateTreeData(this.props.tree.game.children, this.props.tree.gameId);
      return;
    }

    let newTree = tree.updateNode(this.props.tree.game.children, parent, node => {
      swap(node.children, swapIndex1, swapIndex2);
    });

    this.props.updateTreeData(newTree, this.props.tree.gameId);
  }


  render(){

    let content = <Droppable droppableId={`${this.props.parentId}`} type={`type-${this.props.parentId}`}>
      {(provided, snapshot) => (
      <div ref={provided.innerRef}>

        {this.props.data.map((node, index) => (
          <Draggable key={index} draggableId={node.nodeId} index={index} type={`type-${this.props.parentId}`}>
            {(provided, snapshot) => this.props.children(provided, snapshot, node, index)}
          </Draggable>

        ))}
        {provided.placeholder}
      </div>)}
    </Droppable>;



    if(this.props.parentId === -1){
      return <DragDropContext onDragEnd={this.onDragEnd}>{content}</DragDropContext>;
    }

    return content;

  }
}

DragDropComponent.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  parentId: PropTypes.number.isRequired
};


export default DragDropComponent;
