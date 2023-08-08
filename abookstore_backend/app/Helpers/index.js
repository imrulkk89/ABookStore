'use strict'

const shuffle = ( arr ) => {
  let ctr = arr.length;
  let temp;
  let index;

  while(ctr > 0){
    index = Math.floor(Math.random()*ctr);
    ctr--;
    temp = arr[ctr];
    arr[ctr] = arr[index];
    arr[index] = temp;
  }

  return arr;
}

module.exports = {
  shuffle
}
