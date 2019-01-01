function onChoseFile(event){
    event.preventDefault();
    let temp = document.getElementById("chooseBomButton");
    // temp.disabled = true;

    //re init jsToPass
    jsToPass = {};

    //recover upload button style and text content
    document.getElementById('uploadBtn').textContent = 'Confirmed and Upload | 确认无误且上传';
    document.getElementById('uploadBtn').style.color = '#777';

    while(document.getElementById("uploadStatWrapper").lastChild){
        document.getElementById("uploadStatWrapper").removeChild(document.getElementById("uploadStatWrapper").lastChild)
    }

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
        let wb;
        try{
            wb = XLSX.read(reader.result, { type: 'binary' })
        }catch(err){
            document.getElementById("uploadStatWrapper").appendChild(document.createTextNode("please only upload XLSX file"))
            document.getElementById("chooseBomButton").disabled = false;
        }
        getItemInfo(wb); //in xlsxTool
        renderProductAndPartForm();
        document.getElementById('uploadBtn').disabled = false;
        document.getElementById('uploadBtnWrapper').style.display = 'block';
    }

    reader.readAsBinaryString(file)
}

function renderProductAndPartForm(){
  while(document.getElementById("uploadStatWrapper").lastChild){
    document.getElementById("uploadStatWrapper").removeChild(document.getElementById("uploadStatWrapper").lastChild);
  }

  renderProductForm();
  renderPartForm();

  // let statHeadDiv = document.createElement("DIV");
  // let temp = document.createTextNode("uploading " + currentItem["Product Name"]);
  // statHeadDiv.appendChild(temp);
  // document.getElementById("uploadStatWrapper").appendChild(statHeadDiv);
  //
  // partInfoSet.forEach(function(ele){
  //   let statContentDiv = document.createElement("DIV");
  //   let temp = document.createTextNode(ele["Part Name"] + " [" + ele["Part Number"] +"]");
  //   statContentDiv.appendChild(temp);
  //   document.getElementById("uploadStatWrapper").appendChild(statContentDiv);
  // })
}

function renderProductForm(){
  let colName = Object.keys(jsToPass.productInfo);
  colName.splice(colName.indexOf('Part Number Set'), 1);
  let colType = ['text', 'text', 'text', 'text', 'text', 'text', 'text'];
  let colVal = [colName.map((k)=>jsToPass.productInfo[k])];
  let createdTable = createTable(colName, colType, colVal, '[jsToPass.productInfo]');
  createdTable.id = "productInfoTable";
  let tmp = document.createElement('div');
  tmp.appendChild(createdTable);
  tmp.style.marginBottom = '15px';
  document.getElementById("uploadStatWrapper").appendChild(tmp);
}

function renderPartForm(){
  let colName = Object.keys(jsToPass.partInfoSet[0]);
  let colType = ['text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text'];
  // colType[2] = 'number'; colType[8] = 'number';
  let partNum = jsToPass.partInfoSet.length;
  let colVal = [];
  for(let i = 0; i < partNum; i++){
    colVal.push(colName.map((k) => jsToPass.partInfoSet[i][k]));
  }
  let createdTable = createTable(colName, colType, colVal, 'jsToPass.partInfoSet');
  createdTable.id = "partInfoTable";
  let tmp = document.createElement('div');
  tmp.appendChild(createdTable);
  document.getElementById("uploadStatWrapper").appendChild(tmp);
}

function confirmAndUploadBom(ele){
  ele.disabled = true;
  ele.textContent = "Uploading | 上传中";
  myAjax({'sid': extFromCookie('sid'),
          'action': 'uploadBomJson',
          'partInfoSet': jsToPass.partInfoSet,
          'productInfo': jsToPass.productInfo}, function(){
            if (this.readyState == 4 && this.status == 200){
              try{
                let resp = JSON.parse(this.response);
                if(resp.error){
                  uploadBtn.textContent = resp.error;
                  uploadBtn.style.color = '#f00';
                }else{
                  uploadBtn.textContent = 'Upload Successful | 上传成功';
                }
              }catch(err){
                //parse failure
                uploadBtn.textContent = `backend error: | 后端错误: ${this.response}`;
              }

            }
          })
}


///
