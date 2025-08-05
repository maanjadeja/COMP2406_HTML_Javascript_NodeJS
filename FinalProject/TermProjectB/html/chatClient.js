//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
const socket = io() //by default connects to same server that served the page
//let socket = io('http://' + window.document.location.host)
let userLoggedIn=false;
let message="";
let userObject={"message":message,"loggedIn":userLoggedIn};

socket.on('serverSays', function(message) {
  let msgDiv = document.createElement('div')
  /*
  What is the distinction among the following options to set
  the content? That is, the difference among:
  .innerHTML, .innerText, .textContent
  */
  //msgDiv.innerHTML = message
  //msgDiv.innerText = message
  msgDiv.textContent = message
  document.getElementById('messages').appendChild(msgDiv)
})

function sendMessage() {
  let message = document.getElementById('msgBox').value.trim()
  if(message === '') return //do nothing
  socket.emit('clientSays', message)
  // userObject["message"]=message;
  // socket.emit('clientSays', userObject)
  //we should create a sendMessage object:
  //sendMessage{"Sender": , "Message":, "Private":}
  //Sender is the person sending the message
  //Message is the message we are sending
  //If Private is ["Sean"] for example, it will only send the message to Sean, it basically holds
  //the names of all the users you want to send a message to 

  document.getElementById('msgBox').value = ''
}

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY && document.getElementById("send_button").disabled == false) {
    sendMessage()
    return false //don't propogate event
  }
}

function checkConnectAsInput(){

  let connectAsInput = document.getElementById('connectAsInput').value;

  
  if(connectAsInput.trim().length > 0){
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let resultOfSpecialCharacters;

    if((connectAsInput[0].match(/[a-z]/i))){
      console.log("PASSED FIRST LETTER TEST: "+connectAsInput[0]);

      resultOfSpecialCharacters = specialChars.test(connectAsInput);
      console.log("are there special characters: "+resultOfSpecialCharacters)
      if(resultOfSpecialCharacters==true){
        // console.log("fail special character test")
        document.getElementById('connectAsInput').value=""

      }
      else{
        // console.log("special character test passed")
        // socket.on('connection', function(socket) {
        //   console.log("Client Connected!");

        // })
        userLoggedIn=true;
        // socket = io('http://' + window.document.location.host)//This line logs in anyone who opens the link
        // userObject["loggedIn"]=userLoggedIn;
        // socket.emit('clientSays', userLoggedIn)
        document.getElementById("send_button").disabled = false
        socket.emit('clientSays', connectAsInput)

        
        
      }
  
    }
    else{
      console.log("INCORRECT INPUT: "+connectAsInput)

    }

  }



}

function createNewUser(){

  let registrationDiv = document.getElementById('outputDisplay')

  // let theHTMLCode = 
  // "<input type='text' placeholder='Username' id='newUserName'> <br> <input type='text' placeholder='Password' id='newPassword'> <br> <input type='text' placeholder='Password' id='newPasswordRpt'> <button id='createUser' >Register</button>"
  
  registrationDiv.innerHTML = "<p>YOOYOYOYO</p>";
  

}

//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('send_button').addEventListener('click', sendMessage)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)

  document.getElementById('connect_as_button').addEventListener('click',checkConnectAsInput)

  document.getElementById('createNewUser').addEventListener('click', createNewUser);
  
})
