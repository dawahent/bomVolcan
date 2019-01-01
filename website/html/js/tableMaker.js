var setOfValue = ["Product Item Id", "Product Name", "Prepare by", "Date", "Rev", "Customer", "Verify by", "Part Number", "Item", "Source",
"Part Name", "Mtl Specification", "Unit", "Q\'ty\/Set", "Vendor", "Remark"];

var directFromPart = ["Part Number", "Item", "Source", "Part Name", "Mtl Specification", "Unit", "Vendor", "Remark"];

var jsToFetch = {};
//four types of col to retrieve:
//*) empty
//a) directly from part json
//b) check belong in part json to get, only belong to one product
//c) check belong in part json to get, belong to multiple products

//recently only consider *), a) and b)
function makeTable(dt){
    //clear the made table
    let tableArea = document.getElementById("tableWrapper");
    while(tableArea.hasChildNodes()){
        tableArea.removeChild(tableArea.lastChild);
    }

    //make header
    let headerRow = document.createElement("tr")
    for(let i = 0; i < selectorValueSet.length; i++){
        let temp = document.createElement("th");
        temp.appendChild(document.createTextNode(selectorValueSet[i]))
        headerRow.appendChild(temp);
    }
    tableArea.appendChild(headerRow)

    //append data
    // console.log(lastReqPartNumbers)
    for(let i = 0; i < lastReqPartNumbers.length; i++){
        let dataRow = document.createElement("tr");
        for(let j = 0; j < selectorValueSet.length; j++){
            let temp = document.createElement("td");
            if(dt[lastReqPartNumbers[i]] && dt[lastReqPartNumbers[i]][selectorValueSet[j]]){
                temp.appendChild(document.createTextNode(dt[lastReqPartNumbers[i]][selectorValueSet[j]]))
            }else{
                if(selectorValueSet[j] === "Part Number"){
                    temp.appendChild(document.createTextNode(lastReqPartNumbers[i]))
                }else{
                    temp.appendChild(document.createTextNode(" "))
                }

            }
            dataRow.appendChild(temp)
        }
        tableArea.appendChild(dataRow)
    }

    let wb = XLSX.utils.table_to_book(document.getElementById("tableWrapper"), {sheet:"Sheet JS"});
    let wbout = XLSX.write(wb, {bookType:"xlsx", bookSST:true, type: 'binary'});
    let fname = 'result.xlsx'
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fname);
}

function onRequest(event){
    event.preventDefault()

    //clear table wrapper first
    while(document.getElementById('tableWrapper').lastChild){
      document.getElementById('tableWrapper').removeChild(document.getElementById('tableWrapper').lastChild);
    }

    //fetch query values
    let toReq = document.getElementById("requestPartNumbers").value;
    console.log(toReq);

    if(toReq === "" || selectorValueSet.length == 0) return;
    console.log('wo');
    let temp = toReq.split("\n");

    console.log(temp);
    console.log(toReq);

    let queryVals = []
    for(let i = 0; i < temp.length; i++){
        if(temp[i] === "") continue
        queryVals.push(temp[i])
    }

    lastqueryVals = queryVals;

    let req = {};
    req.action = "reqPartInfo";
    req.query = queryVals;
    req.queryBy = getQueryBy();
    req.sid = extFromCookie('sid');

    console.log(req);

    myAjax(req,function() {
        if (this.readyState == 4 && this.status == 200) {

            jsToFetch = JSON.parse(this.responseText);
            console.log(jsToFetch)
            renderTableAndOutputCSV(jsToFetch);
            // makeTable(res.actualData);
        }
    });
}

function getQueryBy(){
  let radioList = document.querySelectorAll("input[name='queryBy']");
  for(let i = 0; i < radioList.length; i++){
    if(radioList[i].checked)
      //one checked is guarantee
      return radioList[i].value;
  }
}

function renderTableAndOutputCSV(queryResult){
  //right now assume each part only belong to one product
  let tempDict = {};
  queryResult['productSet'].forEach(function(p){
    tempDict[p['_id']] = p;
  });

  let colName = selectorValueSet;
  let colVal = [];
  queryResult['partInfoSet'].forEach(function(js){
    let toPush = [];
    colName.forEach(function(col){
      if(directFromPart.indexOf(col) != -1){
        toPush.push(js[col]);
      }else{
        if(col === "(empty)"){
          toPush.push('');
        }else{
          if(col === "Q\'ty\/Set"){
            toPush.push(js['belong'][0][1]);
          }else{
            //lookup product
            belongedProductId = js['belong'][0][0];
            toPush.push(tempDict[belongedProductId][col]);
          }
        }
      }
    });
    colVal.push(toPush);
  });

  let crTable = createTable(colName, [], colVal, '');
  crTable.id = 'partInfoTable';
  document.getElementById('tableWrapper').appendChild(crTable);
  document.getElementById('downloadTableButton').disabled = false;
  // outputCSV('partInfoTable');
}

function onDownloadCSV(event){
  event.preventDefault();

  outputCSV('partInfoTable');
}


//
