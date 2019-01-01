
function signIn(event,btn){
  event.preventDefault();
  btn.disabled = true;
  let usrName = document.getElementById('usrNameField').value;
  let psw = document.getElementById('pswField').value;

  myAjax({username: usrName, password: md5(psw), action:'signIn'},function(){
    if (this.readyState == 4 && this.status == 200){
      let res = JSON.parse(this.response);
      document.cookie="sid="+res.sid;
      checkSignInOut();
      btn.disabled = false;
    }
  })
}

function signOut(event,btn){
  btn.disabled = true;
  document.cookie="sid=11;expires=Thu, 01 Jan 1970 00:00:01 GMT";
  checkSignInOut();
  btn.disabled = false;
}
