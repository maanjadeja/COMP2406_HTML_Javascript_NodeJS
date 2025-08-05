function getSong() {

    let songTitle = document.getElementById('songTitleTextField').value.trim()
    console.log('songTitle: ' + songTitle)
    if(songTitle === '') {
        return alert('Please enter a Song Title')
    }

    let songsDiv = document.getElementById('songs_div')
    songsDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
 			songsDiv.innerHTML = songsDiv.innerHTML + `
			<h1>Songs matching: ${songTitle} </h1>
      <p>${xhr.responseText}</p>
			`
      }
    }
    xhr.open('GET', `/songs?title=${songTitle}`, true)
    xhr.send()
}

//Attach Enter-key Handler
const ENTER=13

function handleKeyUp(event) {
event.preventDefault()
   if (event.keyCode === ENTER) {
      document.getElementById("submit_button").click()
  }
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit_button').addEventListener('click', getSong)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keyup', handleKeyUp)
  
})
