let chords1 = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
let chords2 = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']

// this will return the new note after the transpose up
function getTransposeUpNote(chord) {
    let ans = "";

    // get the index of the note in chords1 array
    let index = chords1.indexOf(chord);

    // if note found in the chords1 array
    if (index != -1) {

        // ans will be the next available note in chord1 array
        ans = chords1[(index + 1) % 12];
    }
    // if note does not found in chords1 array
    else {
        // get the index of note in chords2 array
        index = chords2.indexOf(chord);

        // ans will be the next available chord in chords2 array
        ans = chords2[(index + 1) % 12];
    }
    return ans;
}

// this will return the new note after the transpose down
function getTransposeDownNote(chord) {
    let ans = "";

    // get the index of the note in chords1 array
    let index = chords1.indexOf(chord);

    // if note found in the chords1 array
    if (index != -1) {

        // ans will be the previouse available note in chord1 array
        ans = chords1[(index - 1 + 12) % 12];
    }
    // if note does not found in chords1 array
    else {
        // get the index of note in chords2 array
        index = chords2.indexOf(chord);

        // ans will be the previous available chord in chords2 array
        ans = chords2[(index - 1 + 12) % 12];
    }
    return ans;
}

function getTransposeUpChord(chord){
    let ans = "";
    for(let i=0;i<chord.length;i+=1){ //loop through the chord that is given in the parameters
        let char = chord[i]; //store each character into that particular chord
        if(char >= 'A' && char <= 'G'){ //check if the letters are bound in the range defined in the assignment
            if(i+1 < chord.length && (chord[i+1] == '#' || chord[i+1] == 'b')){ //check if the length is valid and of the 2nd character is # or b
                ans += getTransposeUpNote(char + chord[i+1]); //store the getTransposeUpNote in ans
                i += 1; 
            }
            else{
                ans += getTransposeUpNote(char); //store the getTransposeUpNote in ans if no specific checking is required
            }   
        }
        else{
            ans += char; //store any pending character not applied into the ans variable
        }
    }
    return ans;
}

function getTransposeDownChord(chord){
    let ans = "";
    for(let i=0;i<chord.length;i+=1){//loop through the chord that is given in the parameters
        let char = chord[i]; //store each character into that particular chord
        if(char >= 'A' && char <= 'G'){ //check if the letters are bound in the range defined in the assignment
            if(i+1 < chord.length && (chord[i+1] == '#' || chord[i+1] == 'b')){ //check if the length is valid and of the 2nd character is # or b
                ans += getTransposeDownNote(char + chord[i+1]); //store the getTransposeUpNote in ans
                i += 1;
            }
            else{
                ans += getTransposeDownNote(char); //store the getTransposeUpNote in ans if no specific checking is required
            }   
        }
        else{
            ans += char; //store any pending character not applied into the ans variable
        }
    }
    return ans;
}


// this will return the chords and lyrics of the line
function getChordsAndLyrics(line) {
    let chord = "";
    let lyrics = "";

    // this is to check if current character is of chord or lyric
    let isChord = false;

    // this is to check if line contains any chord or not
    let isChordPresent = false;

    // for every character of the line
    for (let char of line) {

        // if given character is the part of the chord,
        // then add that character in chord line
        // here we will do nothing in lyric line becasue
        // we do not want to add any extra space under the chord
        if (isChord === true) {

            // if chord is present, then mark flag as true
            isChordPresent = true;

            // if we found the closing breaket, then mark the flag as false
            // and add the space in the chord (this is because, when 2 chord strings are
            // very near to each other, we can put one space between them)
            // else add the character in the chord string
            if (char === ']') {
                isChord = false;
                chord += " ";
            }
            else {
                chord += char;
            }
        }
        // if given character is not in the chord,
        // then add the character in the lyrics
        // here, we will only add the space in chord string if
        // the length of the chord is equals to lyrics
        else {
            // if we found the opening the breaket, then mark the isChord flag as true
            if (char === '[') {
                isChord = true;
            }
            else {
                if (chord.length === lyrics.length) {
                    chord += " ";
                }
                lyrics += char;
            }
        }
    }

    // this object contains lyrics, chord string and a flag that shows if
    // chord presents in the line or not
    let res = { "lyrics": lyrics, "chord": chord, "isChordPresent": isChordPresent }
    return res;
}