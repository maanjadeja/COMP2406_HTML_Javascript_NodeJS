//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
let socket;//by default connects to same server that served the page

let username; 


function sendMessage() {
  let message = document.getElementById('msgBox').value.trim()
  if (message === '') return //do nothing

  console.log("message", message)
  const data = { //Object that stores the senders name and the message
    sender: username,
    message: message
  }

  socket.emit('clientSays', data)

  document.getElementById('msgBox').value = ''
}

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY && document.getElementById("send_button").disabled == false) {
    sendMessage()
    return false //don't propogate event
  }
}

function checkConnectAsInput() {

  let connectAsInput = document.getElementById('connectAsInput').value;


  if (connectAsInput.trim().length > 0) { 
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let resultOfSpecialCharacters;

    if ((connectAsInput[0].match(/[a-z]/i))) { //Username starts with a letter
      console.log("PASSED FIRST LETTER TEST: " + connectAsInput[0]);

      resultOfSpecialCharacters = specialChars.test(connectAsInput); //Username does not have special characters
      console.log("are there special characters: " + resultOfSpecialCharacters)
      if (resultOfSpecialCharacters == true) {
        // console.log("fail special character test")
        document.getElementById('connectAsInput').value = ""

      }
      else {
        // console.log("special character test passed")
        // socket.on('connection', function(socket) {
        //   console.log("Client Connected!");

        // })
        // socket = io('http://' + window.document.location.host)//This line logs in anyone who opens the link

        // disable connect as div

        //Enable all fields when a valid username is inputted
        document.getElementById("connectAsInput").disabled = true;
        document.getElementById("connect_as_button").disabled = true;

        document.getElementById("send_button").disabled = false
        document.getElementById("msgBox").disabled = false

        username = connectAsInput;

        // socket.emit('clientSays', connectAsInput)
        // socket.emit('clientSays', userObject)

        establishConnection();
        socket.emit("userConnect", { username })

        document.getElementById('connectAsInput').value = ""

      }

    }
    else {
      console.log("INCORRECT INPUT: " + connectAsInput)

    }

  }

}

function establishConnection() { 
  socket = io();
  socket.on("ack", function (message) { //Make connection on ack to acknowledge a connection
    console.log("message", message)
    document.getElementById("connect_message").innerHTML = message;
  })

  socket.on('serverSays', function (data) {
    console.log("herere");
    let msgDiv = document.createElement('div')
    /*
    What is the distinction among the following options to set
    the content? That is, the difference among:
    .innerHTML, .innerText, .textContent
    */
    //msgDiv.innerHTML = message
    //msgDiv.innerText = message
    // let returnUsrObject = {theOutput:"", isPrivate:""}

    // console.log("the Return Object: " + message);
    // console.log("the Return Object Message: " + message.theOutput);
    // console.log("the Return Object Message Is Private: " + message.isPrivate);
    // console.log("the Return Object Text Is Blue: " + message.textIsBlue);

    console.log(data);

    if (data.type === "private") { //Message is red if it is private
      //set the colour to red
      msgDiv.style.color = "red";

    }
    if (data.type === "broadcast" && data.sender === username) { //Message is blue if it sent by sender
      msgDiv.style.color = "blue";
    }


    msgDiv.textContent = `${data.sender}: ${data.message}`
    document.getElementById('messages').appendChild(msgDiv)


  })
}
function clearChatContent() { //Clear the chat content for current user
  document.getElementById("messages").innerHTML = "";
}

function createNewUser(){

  let registrationDiv = document.getElementById('connect_message')

  let theHTMLCode = 
  "<p>New Username:</p><input type='text' placeholder='Username' id='newUserName'> <br> <p>New Password:</p><input type='text' placeholder='Password' id='newPassword1'> <br> <input type='text' placeholder='Re-type Password' id='newPassword2'> <button id='createUser' >Register</button>"
 
  registrationDiv.innerHTML = theHTMLCode;

  let newUserName = document.getElementById('newUserName')
  let newPassWord1 = document.getElementById('newPassword1')
  let newPassWord2 = document.getElementById('newPassword2')

  document.getElementById('createUser').addEventListener('click', registerTheUser);

  

}

//Add event listeners
document.addEventListener('DOMContentLoaded', function () {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('send_button').addEventListener('click', sendMessage)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)

  document.getElementById('connect_as_button').addEventListener('click', checkConnectAsInput)

  document.getElementById('clear_button').addEventListener('click', clearChatContent)

  document.getElementById('createNewUser').addEventListener('click', createNewUser);



})
