module.exports = function(o){
  var a = [];
  var p = o.previousSibling;
  while(p){
    if(p.nodeType === 1){
      a.push(p);
    }
    p = p.previousSibling;
  }
  a.reverse();
  var n = o.nextSibling;
  while(n){
    if(n.nodeType === 1){
      a.push(n);
    }
    n = n.nextSibling;
  }
  return a;
};
