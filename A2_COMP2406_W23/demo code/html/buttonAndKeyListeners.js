//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


const fs = require('fs')

function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW


  }
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}


function handleSubmitButton() {

  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {
    lastPuzzle = userText;
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = ''
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`

    let userRequestObj = {
      text: userText
    }
    // console.log(userRequestObj);
    let userRequestJSON = JSON.stringify(userRequestObj)
    // let userRequestJSON = JSON.parse({userRequestObj})

    console.log("USER REQUEST JSON: " + userRequestJSON)
    document.getElementById('userTextField').value = ''
    //alert ("You typed: " + userText);

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("data: " + this.responseText)
        console.log("typeof: " + typeof this.responseText)
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
        console.log("ResponseObj: " + responseObj)
        // movingString.word = responseObj.text
        // movingString.word = responseObj.filePath
        // let songArray = responseObj.songLines.split(" ")
        // console.log(songArray)
        // words = songArray;

        if (responseObj.text.includes("NOT FOUND") === false) {

          movingString.word = "FOUND"

          // console.log("theResponseObj.toString(): "+typeof responseObj.songLines.toString());


          // let allSongWords = JSON.stringify(responseObj.songLines)


          /*for( letters in allSongWords){
            console.log("LETTERS: "+allSongWords[letters])
          }*/





          // console.log("ALLSONGWORDS BEFORE SPLIT: "+allSongWords);
          // allSongWords = allSongWords.split(",")

          // console.log("ALL SONG WORDS AFTER .SPLIT(): "+allSongWords)



          // allSongWords = allSongWords.replace(',',', ')
          // allSongWords = allSongWords.split(",")

          // allSongWords = allSongWords.toString();


          // allSongWords = allSongWords.replace(/['"]+/g, '');



          words = []; //reset the words array to empty
          for (let i = 0; i < responseObj.songWords.length; i++) { //loop through the array
            let songArrayObject = { word: responseObj.songWords[i], x: i * 10, y: i * 20 } //create the object to add into words[] array
            words.push(songArrayObject); //start at index 0 of the array so we we have a new array
          }
          randomizeLocationOfWords();



        }
        else {
          movingString.word = "NOT FOUND: " + userText;

        }

        // movingString.word = responseObj.songLines



        drawCanvas()
      }

    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}

function handleSolvePuzzle() { //Handle Button Solve Puzzle

  /*words.push({ word: "I", x: 50, y: 50 })
  words.push({ word: "like", x: 70, y: 50 })
  words.push({ word: "javascript", x: 120, y: 50 })*/

  var lines = [];
  // sort words by Y coordinates
  words.sort(function (a, b) { //Sort according to coordinates
    if (a.y < b.y) return -1;
    if (a.y > b.y) return 1;
    return 0;
  })

  let toleranceLevel = 10; //Set tolerance level to be distance to seperate the lines


  let comparedWord = words[0];
  let wordsOfLine = [];
  for (let word of words) {
    if (word.y - comparedWord.y <= toleranceLevel) { //Fill wordsOfLine array to be in order
      wordsOfLine.push(word);
    }
    else {
      comparedWord = word; //Update comparedWord
      wordsOfLine.sort(function (a, b) {
        if (a.x < b.x) return -1;
        if (a.x > b.x) return 1;
        return 0;
      })

      let line = "";
      for (let w of wordsOfLine) { //Hold the output in line with spaces to seperate them
        line += w.word + " ";
      }
      lines.push(line.trim()); //Fill up lines array with line.trim()
      wordsOfLine = [word];
    }
  }

  wordsOfLine.sort(function (a, b) { //Sort the array according to coordinates
    if (a.x < b.x) return -1;
    if (a.x > b.x) return 1;
    return 0;
  })

  let line = "";
  for (let w of wordsOfLine) { //Hold the output in line with spaces to seperate them
    line += w.word + " ";
  }
  lines.push(line.trim());





  // let textDiv = document.getElementById("text-area")
  // textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`

  let userRequestObj = { //Create userRequestObj that holds the lines of the puzzle and the puzzle
    lines: lines,
    puzzleName: lastPuzzle
  }

  console.log("userRequestObj", userRequestObj);
  let userRequestJSON = JSON.stringify(userRequestObj)
  document.getElementById('userTextField').value = ''
  //alert ("You typed: " + userText);

  fetch("/solved", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userRequestObj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
      //process the data how you want

      console.log("data: " + this.responseText)
      console.log("typeof: " + typeof this.responseText)
      //we are expecting the response text to be a JSON string
      let responseObj = data;
      if (responseObj.text.includes("FOUND") === true) {

        let textDiv = document.getElementById("text-area")
        textDiv.innerHTML = ""; //Set innerHTML to be empty to update every time Solve Puzzle is clicked
        if(responseObj.solved === true){ //Case for when puzzle is solved
          for (let line of lines) {
            textDiv.innerHTML += `<p class=correctText> ${line}</p>` //Output result in green text
          }
        }
        else{ //Case for when puzzle is not solved
          for (let line of lines) {
            textDiv.innerHTML += `<p class=wrongText> ${line}</p>` //Output result in red text
          }
        }

      }


    })
    .catch((error) => {
      console.error('Error:', error)
    })

}

