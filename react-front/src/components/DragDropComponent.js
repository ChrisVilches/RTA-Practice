import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as tree from '../tree';

class DragDropComponent extends React.Component {

  constructor(){
    super();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {

    let reorder = (list, startIndex, endIndex) => {
      let result = Array.from(list);
      let [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let data = reorder(
      this.props.data,
      result.source.index,
      result.destination.index
    );

    let newSegments = tree.updateNode(this.props.tree.game.children, data[0].nodeId, (node, parent) => {
      if(parent === null){
        this.props.updateTreeData(data, this.props.tree.gameId);
        return;
      }

      parent.children = data;
      this.props.updateTreeData(data, this.props.tree.gameId);
    });

  }


  render(){

    if(this.props.parentId === -1){
      return <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={`droppable${this.props.parentId}`}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>

              {this.props.data.map((node, index) => (

                <Draggable key={node.nodeId} draggableId={node.nodeId} index={index}>
                  {(provided, snapshot) => this.props.children(provided, snapshot, node, index)}

                </Draggable>

              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>;
    }

    return <Droppable droppableId={`droppable${this.props.parentId}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>

            {this.props.data.map((node, index) => (

              <Draggable key={node.nodeId} draggableId={node.nodeId} index={index}>
                {(provided, snapshot) => this.props.children(provided, snapshot, node, index)}

              </Draggable>

            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>;

  }
}

DragDropComponent.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  parentId: PropTypes.number.isRequired
};


export default DragDropComponent;
