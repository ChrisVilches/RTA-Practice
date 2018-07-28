import _ from 'lodash';

export const traversal = function(node, func, parent = null) {
  func(node, parent);
  if(node.hasOwnProperty('children')){
    for(let i=0; i < node.children.length; i++){
      traversal(node.children[i], func, node);
    }
  }
};

export const traverseAllNodes = function(parentSegments, func){
  for(let i=0; i < parentSegments.length; i++){
    traversal(parentSegments[i], func);
  }
}

export const findNode = function(parentSegments, nodeId){
  let node = null;
  traverseAllNodes(parentSegments, function(x){
    if(x.nodeId === nodeId){
      node = x;
    }
  });
  return node;
}

export const findNodeUpdate = function(_parentSegments, nodeId, updateFunction){
  let parentSegments = _.cloneDeep(_parentSegments);
  traverseAllNodes(parentSegments, function(node, parent){
    if(node.nodeId === nodeId){
      updateFunction(node, parent);
    }
  });

  return parentSegments;
}


export const removeNode = function(_parentSegments, nodeId){

  let parentSegments = _.cloneDeep(_parentSegments);

  for(let i=0; i < parentSegments.length; i++){
    if(parentSegments[i].nodeId === nodeId){
      parentSegments.splice(i, 1);
      return parentSegments;
    }
  }

  parentSegments = findNodeUpdate(parentSegments, nodeId, function(node, parent){
    let index = -1;
    for(let i=0; i < parent.children.length; i++){
      if(nodeId === parent.children[i].nodeId){
        index = i;
        break;
      }
    }
    if(index !== -1){
      parent.children.splice(index, 1);
    }
  });
  return parentSegments;
}



export const addNewChildSegment = function(_parentSegments, nodeId, name=''){

  let segments = _.cloneDeep(_parentSegments);
  name = name.trim();

  if(nodeId === -1){
    segments.push({ name });
    return segments;
  }

  segments = findNodeUpdate(segments, nodeId, function(node, parent){
    node.children.push({
      name
    });
  });

  return segments;

}
