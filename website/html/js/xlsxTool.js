function getCellValue(wb,sheetIdx,cellAddr){
  var ws = wb.Sheets[wb.SheetNames[sheetIdx]];
  var desired_cell = ws[cellAddr];
  return desired_cell?desired_cell.v:undefined;
}

function getItemInfo(wb){

  let productNum = getCellValue(wb,0,'A7');

  if(productNum){
    tempSplit = productNum[16];

    productNum = productNum.split(tempSplit);
    // console.log(productNum);
    productNum = productNum[1];
    productNum = productNum.slice(1,productNum.length);
  }else{
    return;
  }



  let preparer = getCellValue(wb,0,'E7');
  if(preparer){
    preparer = preparer.split(":");
    preparer = preparer[1];
  }else{
    preparer = '';
  }



  let dt = getCellValue(wb,0,'H7');
  if(!dt) dt = '';
  // if(typeof dt !== "number") return;

  let productName = getCellValue(wb,0,'A8');
  if(productName){
    productName = productName.split(tempSplit);
    productName = productName[1];
  }else{
    productName = '';
  }


  let rev = getCellValue(wb,0,'H8');
  if(!rev) rev = '';

  let customer = getCellValue(wb,0,'A9');
  // console.log(customer);
  if(customer){
    customer = customer.split(tempSplit);
    customer = customer[1];
  }else{
    customer = '';
  }

  let verifier = getCellValue(wb,0,'E9');
  if(verifier){
    verifier = verifier.split(tempSplit);
    verifier = verifier[1];
  }else{
    verifier = '';
  }

  //part info saver

  let rowNum = 0;
  let seqNoNumber = 0;
  let currentSource = "";
  let maxSeqNoNumber = 20;

  let partNumSet = new Set();
  let partInfoSet = [];

  while(seqNoNumber <= maxSeqNoNumber){
    let item = getCellValue(wb,0,'A'+rowNum);
    // console.log(item)
    if(typeof item !== "number"){
      seqNoNumber += 1
      rowNum += 1;
      continue
    }else{
      seqNoNumber = 0
    }

    let level = getCellValue(wb,0,'B'+rowNum);

    let usage = getCellValue(wb,0,'C'+rowNum);
    if(usage) currentSource = usage;

    let partName = getCellValue(wb,0,'D'+rowNum);

    let partNum = "000" + item.toString()
    partNum = productNum + '-' + partNum.slice(-3)
    partNumSet.add(partNum);

    let mtlSpec = getCellValue(wb,0,'E' + rowNum);

    let unit = getCellValue(wb,0,'F' + rowNum);

    let qty = getCellValue(wb,0,'G' + rowNum)

    let vendor = getCellValue(wb,0,'H' + rowNum)

    let remark = getCellValue(wb,0,'I' + rowNum)

    partInfoSet.push({
      // "From Product" : [productNum],

      "Part Number": partNum,
      "Item": item,
      // "Level": level,
      "Source": currentSource,
      "Part Name": partName,
      "Mtl Specification": mtlSpec,
      "Unit": unit,
      "Q\'ty\/Set": qty,
      "Vendor": vendor,
      "Remark": remark
    })

    rowNum += 1;
  }

  let currentItem = {
    "Product Item Id" : productNum,
    "Product Name": productName,
    "Prepare by": preparer,
    "Date": dt,
    "Rev": rev,
    "Customer": customer,
    "Verify by": verifier,
    "Part Number Set": partNumSet
  }

  console.log(partInfoSet);
  console.log(currentItem);

  jsToPass = {};
  // jsToPass["action"] = "postFetchedData";
  jsToPass.productInfo = currentItem;
  jsToPass.partInfoSet = partInfoSet;



  // myAjax(jsToPass,function(){
  //   if (this.readyState == 4 && this.status == 200){
  //     let res = JSON.parse(this.response);
  //     console.log(res)
  //     document.getElementById("chooseBomButton").disabled = false;
  //
  //     while(document.getElementById("uploadStatWrapper").lastChild){
  //       document.getElementById("uploadStatWrapper").removeChild(document.getElementById("uploadStatWrapper").lastChild)
  //     }
  //     let statHeadDiv = document.createElement("DIV")
  //     let temp = document.createTextNode("uploaded " + currentItem["Product Name"]);
  //     statHeadDiv.appendChild(temp)
  //     statHeadDiv.style.color = "green"
  //     document.getElementById("uploadStatWrapper").appendChild(statHeadDiv)
  //     partInfoSet.forEach(function(ele){
  //       let statContentDiv = document.createElement("DIV")
  //       statContentDiv.style.color = "green"
  //       let temp = document.createTextNode("uploaded " + ele["Part Name"] + " [" + ele["Part Number"] +"]")
  //       statContentDiv.appendChild(temp)
  //       document.getElementById("uploadStatWrapper").appendChild(statContentDiv)
  //     })
  //   }
  //
  // })
}
