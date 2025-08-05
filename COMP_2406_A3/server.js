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

  
  console.log("Socket ID: " + socket.id); 

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

    }
    else {
      

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
console.log(`Open several browsers to: http://localhost:${PORT}/chatClient.html`)
