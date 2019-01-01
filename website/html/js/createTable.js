//colName: column name: [string]
//colType: column types: [string]
//colVal: values in each entry: [[string]] note that inside [string] is row-wise
//valName: name of json variable to be modified when changing cell values: string
//return table element
function createTable(colName, colType, colVal, valName){
  let tableEle = document.createElement('table');
  let colNameRowEle = document.createElement('tr');
  colName.forEach(function(col){
    let colNameEle = document.createElement('th');
    colNameEle.textContent = col;
    colNameRowEle.appendChild(colNameEle);
  });
  tableEle.appendChild(colNameRowEle);

  let numRow = colVal.length;
  // console.log(colVal);
  for(let r = 0; r < numRow; r++){
    let numCol = (colVal[r]).length;
    let colValRowEle = document.createElement('tr');
    for(let c = 0; c < numCol; c++){

      if(valName){
        colValRowEle.innerHTML += `<td><input id='temp' onchange="updateCell(this, ${valName}, ${r}, '${colName[c]}')"
         type=${colType[c]} value=${colVal[r][c]?colVal[r][c]:''}></input></td>`;
      }else{
        colValRowEle.innerHTML += `<td>${colVal[r][c]?colVal[r][c]:''}</td>`;
      }
    }

    tableEle.appendChild(colValRowEle);
  }

  tableEle.style.margin = 'auto';
  return tableEle;
}

function updateCell(ele, jsonListToChange, idx, key){
  jsonListToChange[idx][key] = ele.value;
}
