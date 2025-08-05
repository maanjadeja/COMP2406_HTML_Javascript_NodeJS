
// this function will be called when submit button will be clicked
function handleSumbitButton() {

    // get the song title from input text
    let songTitle = document.getElementById('song-title').value

    if (songTitle) {

        let userRequestObj = {
            text: songTitle
        }
        let userRequestJSON = JSON.stringify(userRequestObj)

        // do communication with server and get song lines
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("typeof: " + typeof this.responseText)
                console.log("data: " + this.responseText)
                //we are expecting the response text to be a JSON string
                let responseObj = JSON.parse(this.responseText)

                if (responseObj.songLines) {

                    // assign fetched song lines to lines variable
                    songLines = responseObj.songLines;
                    renderSong(songLines);
                }
                else {
                    // if song not found, then make songlines empty
                    songLines = [];
                }

                // empty the input box
                document.getElementById("song-title").value = ""

            }
        }
        xhttp.open("POST", "song") //API .open(METHOD, URL)
        xhttp.send(userRequestJSON) //API .send(BODY)

    }
}

// this function will be called when transpose up or down button will be called
function handleTransposeUpButton() {
    // increase the offset
    offset += 1;
    // in this function, we will first of all update songLines 
    // for that we will replace all chords with the tranposed up chords
    // then we will get chord line for that updated songLine
    // we will rerender the text area

    // for every song line
    for (let i = 0; i < songLines.length; i += 1) {
        let line = songLines[i];

        // it will store the new line (with transposed up chords)
        let newLine = "";
        let isChord = false;

        // it will store the chord
        let chord = "";

        // for every character of the line
        for (let j = 0; j < line.length; j += 1) {
            let char = line[j];

            // if that char is part of chord
            if (isChord === true) {
                // and char is closing bracket
                if (char === ']') {
                    isChord = false;

                    // then transpose up the chord
                    newLine += getTransposeUpChord(chord);

                    // add the close bracket in newline
                    newLine += ']';

                    // empty the chord
                    chord = '';
                }
                // if chord is not empty bracket, then add the char in chord
                else { chord += char; }
            }

            // if the char is not part of the chord
            else {
                // and the char is the opening bracket, then mark isChord as true and 
                // add the character in the new line
                if (char === '[') {
                    isChord = true;
                }
                newLine += char;
            }
        }

        // put the updated line in song lines
        songLines[i] = newLine;
    }

    // render the updated song lines
    renderSong(songLines);
}

function handleTransposeDownButton() {
    // decrease the offset
    offset -= 1;
    // in this function, we will first of all update songLines 
    // for that we will replace all chords with the tranposed down chords
    // then we will get chord line for that updated songLine
    // we will rerender the text area

    // for every song line
    for (let i = 0; i < songLines.length; i += 1) {
        let line = songLines[i];

        // it will store the new line (with transposed down chords)
        let newLine = "";
        let isChord = false;

        // it will store the chord
        let chord = "";

        // for every character of the line
        for (let j = 0; j < line.length; j += 1) {
            let char = line[j];

            // if that char is part of chord
            if (isChord === true) {
                // and char is closing bracket
                if (char === ']') {
                    isChord = false;

                    // then transpose down the chord
                    newLine += getTransposeDownChord(chord);

                    // add the close bracket in newline
                    newLine += ']';

                    // empty the chord
                    chord = '';
                }
                // if chord is not empty bracket, then add the char in chord
                else { chord += char; }
            }

            // if the char is not part of the chord
            else {
                // and the char is the opening bracket, then mark isChord as true and 
                // add the character in the new line
                if (char === '[') {
                    isChord = true;
                }
                newLine += char;
            }
        }

        // put the updated line in song lines
        songLines[i] = newLine;
    }

    // render the updated song lines
    renderSong(songLines);
}


