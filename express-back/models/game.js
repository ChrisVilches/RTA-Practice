var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  backgroundImage: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
	children: [],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastPractice: { type: Date, default: Date.now },
  practiceCount: { type: Number, default: 0 }
}, {
  timestamps: true
});


function addDefaultChild(node){

  let emptyNode = {
    name: ''
  };

  node['children'] = [emptyNode];
}

function addDefaultNodes(node){

  if(!node['children']) return;
  for(let i=0; i<node.children.length; i++){
    addDefaultNodes(node.children[i]);
  }
  let hasAtLeastOneGrandSon = false;
  for(let i=0; i<node.children.length; i++){
    if(node.children[i]['children']){
      hasAtLeastOneGrandSon = true;
      break;
    }
  }

  if(hasAtLeastOneGrandSon){
    for(let i=0; i<node.children.length; i++){
      if(!node.children[i]['children']){
        addDefaultChild(node.children[i]);
      }
    }
  }
}

function addDefaultNodeIfEmptyChildrenArray(node){

  let traverse = function(node){

    if(!!node.children && node.children.length == 0){
      node.children.push({
        name: ''
      });
    }
    if(!node['children']) return;
    for(let i=0; i<node.children.length; i++){
      traverse(node.children[i]);
    }
  }
  traverse(node);
}

function setIds(node){
  let idCounter = 0;
  let traverse = function(node){
    node['nodeId'] = idCounter++;
    if(!node['children']) return;
    for(let i=0; i<node.children.length; i++){
      traverse(node.children[i]);
    }
  }
  traverse(node);
}

GameSchema.pre('validate', function(next){

  if(!this.children){
    this.children = [];
  }

  if(this.children.length === 0){

    let node = {
      name: ''
    };

    this.children.push(node);
  }

  let firstLevelNodesNoneHaveChildren = true;

  for(let i=0; i<this.children.length; i++){
    if(this.children[i]['children']){
      firstLevelNodesNoneHaveChildren = false;
      break;
    }
  }

  if(firstLevelNodesNoneHaveChildren){
    for(let i=0; i<this.children.length; i++){
      addDefaultChild(this.children[i]);
    }
  }

  for(let i=0; i<this.children.length; i++){
    addDefaultNodeIfEmptyChildrenArray(this.children[i]);
  }

  addDefaultNodes(this);
  setIds(this);

  next();
});

module.exports = mongoose.model('Game', GameSchema);
