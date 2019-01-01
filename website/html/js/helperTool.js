function extFromCookie(toExt){
    var temp = document.cookie;
    var varName = toExt + "=";
    var varNameIdx = temp.indexOf(varName);
    if(varNameIdx == "-1") return ""; //cookie parse error
    var endIdx = temp.indexOf(";",varNameIdx);
    if(endIdx == -1) endIdx = temp.length;
    return temp.substring(varNameIdx + varName.length, endIdx);
}

function renderJoinBorder(){
    if(!!document.getElementById("join-form")){
        if(document.documentElement.clientWidth < 992){
            document.getElementById("join-form").style.borderRight = "";
            document.getElementById("join-form").style.borderBottom = ".0625rem solid #c1c0c0";
        }else{
            document.getElementById("join-form").style.borderRight = ".0625rem solid #c1c0c0";
            document.getElementById("join-form").style.borderBottom = "";
        }
    }
}

//my Ajax:
function myAjax(toSend,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = cb;
    xhttp.open("POST", "/dynamic/");
    xhttp.send(JSON.stringify(toSend));
}

function say(toSay){
    console.log(toSay)
}

function getExpires(){
    let d = new Date().getTime();
    let exp = new Date(d + 7666000000);
    return exp.toString();
}

function checkValidRegInput(usrName,psw,pswRe,nickName){
    if(psw !== pswRe)
        return "Password not confirm"
    return ''
}

var toTest;
function logFile(event) {
    // body...
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
        toTest = reader.result;
    }

    reader.readAsDataURL(file)
}

function switchToTableMaker(event){
    event.preventDefault();
    let tbmk = document.getElementById("tableMaker");
    let upBom = document.getElementById("uploadBom");
    let sio = document.getElementById("signInOut");
    tbmk.style.display = "block";
    upBom.style.display = "none";
    sio.display = "none";
    checkSignInOut();
}

function switchToUploadBom(event){
    event.preventDefault();
    let tbmk = document.getElementById("tableMaker");
    let upBom = document.getElementById("uploadBom");
    let sio = document.getElementById("signInOut");
    tbmk.style.display = "none";
    upBom.style.display = "block";
    sio.style.display = "none";
    checkSignInOut();
}

function switchToSignInOut(event){
  event.preventDefault();
  let tbmk = document.getElementById("tableMaker");
  let upBom = document.getElementById("uploadBom");
  let sio = document.getElementById("signInOut");
  tbmk.style.display = "none";
  upBom.style.display = "none";
  sio.style.display = "block";
}

function onSelect(event) {
    event.preventDefault()
    // console.log(document.getElementById("myselect").value)

}



function s2ab(s) {
	if(typeof ArrayBuffer !== 'undefined') {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	} else {
		var buf = new Array(s.length);
		for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
}

var CNdict = {
  'Customer': '�˿�'
};

function CNTrans(word){
  if(word in CNdict)
    return CNdict[word];
  return word;
}
