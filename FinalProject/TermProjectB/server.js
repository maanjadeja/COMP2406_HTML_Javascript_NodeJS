/*
(c) 2023 Louis D. Nel
Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/

Before you run this app first execute
>npm install
to install npm modules dependencies listed in package.json file
Then launch this server:
>node server.js

To test open several browsers to: http://localhost:3000/chatClient.html

*/
const server = require('http').createServer(handler)
const io = require('socket.io')(server) //wrap server app in socket io capability
const fs = require('fs') //file system to server static files
const url = require('url'); //to parse url strings
const PORT = process.argv[2] || process.env.PORT || 3000 //useful if you want to specify port through environment variable
//or command-line arguments

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

server.listen(PORT) //start http server listening on PORT

function handler(request, response) {
  //handler for http server requests including static files
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

  fs.readFile(filePath, function (err, data) {
    if (err) {
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err))
      //respond with not found 404 to client
      response.writeHead(404);
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })

}

const loggedInUsers = new Map();


//Socket Server
io.on('connection', function (socket) {
  console.log('client connected')
  //console.dir(socket)
  //how to get the socket id of all the people that connect to the server
  console.log("Socket ID: " + socket.id); //We want to save these Id's somewhere

  //We want to use a let registry = new Map();, here we store: name, id
  //if(!registry.has(name)){
  //   registry.set(name,id)
  // }
  // else{
  //   console.log("The user already exists!")
  // }

  //If you only want to talk to a particular list of user, u can use that dictionary
  // listUser.array.forEach((userName) => {
  //   if(registry.has(userName)){
  //     console.log(userName+": "+registry.get(userName))
  //   }

  // });

  //ALL PRIVATE MESSAGES MUST BE HANDLED IN THE SERVER !!!!!

  //USE THE EMIT CHEAT SHEET AND MAP TO HELP YOU SEND MESSAGE TO ONLY PARTICULAR PEOPLE AND
  //MAKE THE MAP() TO STORE THE USERNAMES AND THEIR ID'S

  //ADDITION BELOW:
  socket.on("userConnect", function (data) { //New socket connection to present connection with username
    const username = data.username;
    console.log("username", username);
    if (username) {
      loggedInUsers.set(username, socket.id);
      console.log("set done", username, socket.id)
      // socket.emit('serverSays', 'You are connected to CHAT SERVER')
      io.to(socket.id).emit("ack", `${username} is connected to CHAT SERVER`)
    }

  })

  socket.on('clientSays', function (data) {
    // console.log('RECEIVED MESSAGE: ' + data.userMessage)
    // console.log('RECEIVED USER: ' + data.userName)

    // // loggedInUsers.push(data);
    // let returnUsrObject = { theOutput: "", isPrivate: "", textIsBlue: "" }
    // let theOutputValue = ""
    // let theIsPrivateValue = false;
    // let theTextIsBlueValue = false;


    if (data.message.includes(":")) {
      let arrayOfUsers = data.message.split(":") //Split input between users and message
      console.log("Array of User: " + arrayOfUsers[0])
      console.log("Message to User: " + arrayOfUsers[1])

      const receivers = arrayOfUsers[0].split(','); //List of all users that will receive the message

      for (let receiver of receivers) {
        receiver = receiver.trim();
        const receiverSocketId = loggedInUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("serverSays", { //Send private message to multiple users
            message: arrayOfUsers[1].trim(),
            type: "private",
            sender: data.sender
          })
        }
      }

      io.to(loggedInUsers.get(data.sender)).emit("serverSays", { //Send private message to back to sender
        message: arrayOfUsers[1].trim(),
        type: "private",
        sender: data.sender
      })
      console.log("THE USERS TO SEND TO: " + receivers);

      // socket.to("room1").emit(/* ... */);
      // for (let i = 0; i < theUsersToSendTo.length; i++) {
      //   console.log("USER " + (i + 1) + ": " + theUsersToSendTo[i]);
      //   if (!loggedInUsers.has(theUsersToSendTo[i])) {
      //     console.log("USER: " + theUsersToSendTo[i] + " DOES NOT EXIST!");
      //   }
      //   else {
      //     // let userObject = {userName:"", userMessage:"",}

      //     console.log("THE SOCKET ID WE WILL SEND TO: " + loggedInUsers.get(theUsersToSendTo[i]))
      //     theOutputValue = data.userName + ":" + arrayOfUsers[1];
      //     theIsPrivateValue = true;
      //     theTextIsBlueValue = false;
      //     returnUsrObject.theOutput = theOutputValue;
      //     returnUsrObject.isPrivate = theIsPrivateValue;
      //     returnUsrObject.textIsBlue = theTextIsBlueValue;

      //     console.log("returnUsrObject.theOutput: " + returnUsrObject.theOutput)
      //     console.log("returnUsrObject.isPrivate: " + returnUsrObject.isPrivate)


      //     io.to(loggedInUsers.get(theUsersToSendTo[i])).emit('serverSays', returnUsrObject);

      //   }
      // }
    }
    else {
      // theOutputValue = data.userName + ":" + data.userMessage;
      // theIsPrivateValue = false;
      // theTextIsBlueValue = true;
      // returnUsrObject.textIsBlue = theTextIsBlueValue;
      // returnUsrObject.theOutput = theOutputValue;
      // returnUsrObject.isPrivate = theIsPrivateValue;

      // console.log("returnUsrObject.theOutput: " + returnUsrObject.theOutput)
      // console.log("returnUsrObject.isPrivate: " + returnUsrObject.isPrivate)
      // console.log("returnUsrObject.textIsBlue: " + returnUsrObject.textIsBlue)


      // //to broadcast message to everyone including sender:
      // io.emit('serverSays', returnUsrObject) //broadcast to everyone including sender

      io.emit("serverSays", { //Send broadcast message to client
        message: data.message,
        type: "broadcast",
        sender: data.sender
      })
    }




    console.log("The SOCKET ID OF CURR USER: " + socket.id)


    //alternatively to broadcast to everyone except the sender
    //socket.broadcast.emit('serverSays', data)
  })

  socket.on('disconnect', function (data) {
    //event emitted when a client disconnects
    console.log('client disconnected')


    for (const usrName of loggedInUsers.keys()) {
      if (loggedInUsers.get(usrName) === socket.id) {
        loggedInUsers.delete(usrName);
      }
      // console.log(key);
    }

    console.log(loggedInUsers);



  })
})

console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:${PORT}/index.html`)
