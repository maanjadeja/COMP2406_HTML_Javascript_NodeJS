 
// this gives html string for chords
function getChordHtml(chords){
    let chordClass;
    if(offset === 0){
        chordClass = "chord-green";
    }
    else{
        chordClass = "chord-red";
    }
    let ans = `<pre class=${chordClass}>${chords}</pre>`;
    return ans;
}

// this give html string for lyrics
function getLyricsHtml(lyrics){
    let ans = `<pre>${lyrics}</pre>`;
    return ans;
}

// it will show the lyrics and chord in text-area
function renderSong(lines) {
    // get the text area
    let textAreaDiv = document.getElementById("text-area");

    // clear the text ares
    textAreaDiv.innerHTML = "";

    for (let line of lines) {
        console.log("line",line) //present the current line to the terminal 
        let obj = getChordsAndLyrics(line); //return the object that contains the object created in getChordsAndLyrics()
        let lyrics = obj.lyrics; //store the songs lyrics
        let chords = obj.chord; //store the songs chords
        let isChordPresent = obj.isChordPresent; //store if the chord is present
        if(isChordPresent == true){
            console.log("getChordHtml(chords)",getChordHtml(chords));
            textAreaDiv.innerHTML += getChordHtml(chords); //place the chord's html code into innerHTML
        }
        textAreaDiv.innerHTML += getLyricsHtml(lyrics); //place the lyric's html code into innerHTML
    }
}