/*
COMP 2406
(c) 2022 Louis D. Nel

Example Simple Server that is prepared to receive GET and POST HTTP requests.
GET requests handle the URL requests from a browser.
POST requests are intended to handle form data.

Launch servcer with
node server.js

Testing:
Use browser to view pages at
http:localhost:3000
http:localhost:3000/
http://localhost:3000/index.html

Cntl+C in console to stop server.
*/


const http = require("http") //needed for http communication
const url = require("url") //used to parse url strings

let visitorCounter = 0

http.createServer(function(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log("\n============================")
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ''

  //Event handler to collect message data that might
  //arrive in chunks (several smaller TCP/IP messages)

  request.on("data", function(chunk) {
    receivedData += chunk
  })

  //Event handler for the end of the message data
  request.on("end", function() {
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //Problem 3: To see all the key-value pairs in side the request coming in we input the code below
      /*console.log('request:' + request)
      console.log('\nREQUEST OBJECT KEYS (own property):')
      for(k in request) if(request.hasOwnProperty(k)) console.log('key: ' + k)*/
      
      //If you want to see what type of data is associated with each key use the following code instead:
      console.log('request:' + request)
      console.log('\nREQUEST OBJECT KEYS (own property):')
      for(k in request)
         if(request.hasOwnProperty(k)) console.log('key: ' + k + ' typeof: ' + typeof request[k])

      //Notice among this output we appear to be intercepting the URL of the resource the client is requesting and the HTTP method. 
      //Lets look at their values to see if they match what we saw in the browser.   
      console.log("")
      console.log("url: " + request.url)
      console.log("method: " + request.method)

      //It's also very useful to see the keys and values of the request object's headers.
      console.log("")
      console.log("request headers:")
      console.log(request.headers)
      visitorCounter++

      if (request.method === "GET") {
        //Handle HTTP GET requests from browser
        if (urlObj.pathname === "/" || urlObj.pathname === "/index.html") {
          //ROUTE / or /index.html
          response.writeHead(200, {
            "Content-Type": "text/html"
          })
          response.write('<!DOCTYPE html>')
          response.write('<html>')
          response.write('<head>')

          //Problem 4
          response.write('<style>')
          response.write('body{ background-color: lightblue;}')
          response.write('h1{ text-align:center; color: white;}')

          response.write('</style>')

          response.write('</head>')
          response.write('<body>')
          // response.write('<h1>Hello World</h1>')
          //Optional Work:
          let urlString= request.url
          let index = urlString.indexOf("?name=") //gives the index of the first character
          let urlSectionLength = "?name=".length //gives the length of ?name=
          let startingIndexOfName = index+urlSectionLength
        
          // console.log(`The URL: ${urlString}`)
          // console.log(`The index of "?name=" ${index}`)
          // console.log(`The starting index of name: ${startingIndexOfName}`) 

          let nextIndexOfEquals = urlString.indexOf("=",index+urlSectionLength) //we check for the next "=" sign after ?name
          // console.log(`The index of the next = sign ${nextIndexOfEquals}`)

          let nameSectionOfURL = urlString.substring(index+urlSectionLength,nextIndexOfEquals)
          // console.log(`Name section of URL: ${nameSectionOfURL}`)
          //now we have to check only in that particular range of index: START[index+urlSectionLength], END[lastIndexOfEquals]

          let endOfTheNameInURL=-1;
          for(let i=0; i<nameSectionOfURL.length; i++){
            // console.log(nameSectionOfURL[i]);
            if(!nameSectionOfURL[i].match(/[a-z]/i)){
              endOfTheNameInURL=i;
            }
          }
          

          // console.log(`end Index Of name ${endOfTheNameInURL}`)

          let finalName=""
          if(nextIndexOfEquals!=-1){
            finalName = nameSectionOfURL.substring(0,endOfTheNameInURL)
            // console.log(`final name: ${finalName}`)
          }
          else{
            // console.log(`inside the else statement`)
            // console.log(`urlString ${urlString}`)

            // console.log(`The Name: ${urlString.substring(startingIndexOfName, urlString.length)}`)

            finalName = urlString.substring(startingIndexOfName, urlString.length)

          }
          
          


          if(index > 0){
            // let name = urlString.substring(index + "?name=".length, urlString.length)
            // response.write("Hello " + name)
            // response.write(`<h1>Hello ${name}</h1>`)
            response.write(`<h1>Hello ${finalName}</h1>`)
          }
           else{
             response.write("<h1>Hello World</h1>")
           }
          
          response.write('<p>Greetings COMP 2406</p>')
          response.write(`<p>You are visitor ${visitorCounter}</p>`)
          response.write('</body>')
          response.write('</html>')
        }
        //Problem 5
        else if(urlObj.pathname === "/login.html"){

          response.write('<!DOCTYPE html>')
          response.write('<html>')
          response.write('<head>')

          //Problem 4
          response.write('<style>')
          response.write('body{ background-color: lightblue;}')
          response.write('h1{ text-align:center; color: white;}')

          

          response.write('</style>')

          response.write('</head>')
          response.write('<body>')

          //Problem 5,6
          // PROBLEM 6: method="POST"
          response.write('<form action="/credentials" method="POST">')
          response.write('<label for="userId">User ID:</label><br>')
          response.write('<input type="text" id="inputUserID" name="user_ID"><br>')
          response.write('<label for="password">Password:</label><br>')
          response.write('<input type="text" id="inputPassword" name="pass_word"><br>')
          response.write(' <input type="submit" value="Submit">') 
          response.write('</form>')

          response.write('</body>')
          response.write('</html>')


        }
         else {
          //ROUTE unknown
          response.writeHead(404)
          response.write("ERROR: PAGE NOT FOUND")
        }

        response.end() //send response to client
      } //end get

    //if it is a POST request then echo back the data.
    if (request.method === "POST") {
      //Handle POST requests
      console.log(`POST receivedData: ${receivedData}`)

      let indexOfUser_Id = receivedData.indexOf("user_ID=");
      let lengthOfUserIdURLSection = "user_ID=".length
      
      let startingIndexForUserName = indexOfUser_Id+lengthOfUserIdURLSection;

      let indexOfNextEqualSign = receivedData.indexOf("=",startingIndexForUserName)

      // console.log(`Index of the equal sign in user_ID= ${indexOfUser_Id+(lengthOfUserIdURLSection-1)}`)
      
      // console.log(`Index of the equal sign AFTER user_ID= ${indexOfNextEqualSign}`)

      let everyThingBetweenEqualSigns = receivedData.substring(indexOfUser_Id+1+(lengthOfUserIdURLSection-1), indexOfNextEqualSign)

      // console.log(`Everything between equal signs: ${everyThingBetweenEqualSigns}`)

      let indexOfEndOfName=-1;

      for(let i = 0; i<everyThingBetweenEqualSigns.length; i++){
        //  console.log(everyThingBetweenEqualSigns[i])
         if(everyThingBetweenEqualSigns[i].toUpperCase() === everyThingBetweenEqualSigns[i].toLowerCase()){
            // console.log(`Index: ${i}`)
            indexOfEndOfName=i;
            break;
          //  indexOfEndOfName=i;
         }
        /*
        if(!nameSectionOfURL[i].match(/[a-z]/i)){
              endOfTheNameInURL=i;
            }
         */
      }

      // console.log(`starting index of userid: ${startingIndexForUserName}`)
      // console.log(`ending index of userid: ${indexOfEndOfName}`)
      let finalUserId = everyThingBetweenEqualSigns.substring(0, indexOfEndOfName);
      // console.log(`final User Id: ${finalUserId}`);

      //respond to client
      response.writeHead(200, {
        "Content-Type": 'text/html'
      })
      response.write('<!DOCTYPE html>')
      // response.write('<html><head></head><body><p>Thanks for your request</p></body></html>')
      response.write(`Thanks user: ${finalUserId} for your request`)
      response.end() //send just the JSON object as plain text
    } //post
  }) //request on
}).listen(3000)

console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000")
console.log("http://localhost:3000/")
console.log("http://localhost:3000/index.html")
console.log("http://localhost:3000/login.html")

