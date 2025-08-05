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
      
        //Enable all fields when a valid username is inputted
        document.getElementById("connectAsInput").disabled = true;
        document.getElementById("connect_as_button").disabled = true;

        document.getElementById("send_button").disabled = false
        document.getElementById("msgBox").disabled = false

        username = connectAsInput;

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


})
