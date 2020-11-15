//Start game on click
document.getElementById("btn").addEventListener("click", function(){
    //Hide startbutton and settings onclick
    document.getElementById("btn").hidden = true;
    document.querySelector(".who").hidden = true;
    document.querySelector(".howmany").hidden = true;

    //Check for mobile phone
    if(screen.width<600){
        document.querySelector('.questions').insertAdjacentHTML('afterbegin', '<input type="text" id="text" name="text" pattern="[a-z]*" inputmode="text" />');
        document.getElementById("text").focus();
        // document.getElementById("text").hidden = true;
    }

    //Pick secret word and add underscores secret word
    let charSecretWord = [];
    let radioNumber = document.getElementsByName('number');
    for (let i = 0; i<radioNumber.length; i++) {
        if(radioNumber[i].checked) {
            //Picksecretword
            fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minLength=${i+5}&maxLength=${i+5}&limit=1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
                .then(response => response.json())
                .then(data => {
                    let secretWord = data[0].word.toLowerCase();
                    console.log(secretWord);
                    charSecretWord = secretWord.split('');
                    })
            //Add underscores to DOM
            for(j=0;j<i+5;j++){
                document.getElementById('word').insertAdjacentHTML('afterbegin', '<span class="letter">_ </span>');
            }
        }
    }
    

    //Chosen letters
    let arrKey = []; //array with chosen keys
    hangmanPic = 1; //needs to be outside of keydown function, otherwise reset to 1 every time
    let gender = document.getElementsByName('gender');

    document.addEventListener("keydown", function(event) {
        //Check if chosen letter is not in secretword and if so change picture hangman
        if(!charSecretWord.includes(event.key)){
            hangmanPic++;
            if(gender[1].checked && hangmanPic==8){ //changing picture to female
                hangmanPic=9;
            }
            document.getElementById('hangman').setAttribute("src", `./images/${hangmanPic}.png`);

            //Check if hangman is dead
            if((gender[0].checked&&hangmanPic>8)||(gender[1].checked && hangmanPic>9)){
                document.getElementById('hangman').setAttribute("src", `https://media.giphy.com/media/gIqusaeYxgSiY/giphy.gif`)
                setTimeout(()=>{ //timeout otherwise alert comes before last pic
                    if(!alert('Game over')){window.location.reload();} //alert + reload page to play again
                },150)  
            }
        }

        //Check if chosen letter is in secretword and if so replace underscore       
        let indices = [];
        let idx = charSecretWord.indexOf(event.key);
        while (idx != -1) {
            indices.push(idx);
            document.querySelectorAll('.letter')[idx].innerText = event.key;
            idx = charSecretWord.indexOf(event.key, idx + 1);
        }

        //adding letter to 'already chosen letters' container
        //add key to array
        let lettersDiv = document.getElementById("letters");
        let tempSpan = document.createElement('span');
        tempSpan.setAttribute('id','chosenletter');
        tempSpan.innerHTML = event.key;
        if(!arrKey.includes(event.key) && event.key.match(/[a-z]+/g)){
            lettersDiv.insertAdjacentElement('afterbegin', tempSpan);
            arrKey.push(event.key); //add chosen key to arrkey
        }

        //Check if word is guessed and time not up
        let checker = (arr, target) => target.every(v => arr.includes(v));
        let charSecretWordUniq = [...new Set(charSecretWord)]; //Remove duplicates from charSecretWord
        if((checker(arrKey,charSecretWordUniq))&&timeleft>0){
            document.getElementById("timer").innerHTML = "";
            setTimeout(()=>{ //timeout otherwise alert comes before DOM update
                if(!alert('Yaaay')){window.location.reload();} //alert + reload page to play again
            },10)  
        }
    })
    
    //Timer
    let timeleft = 180;

    let downloadTimer = setInterval(function function1(){
    document.getElementById("timer").innerHTML = timeleft + 
    " "+"seconds remaining";

    timeleft -= 1;
    if(timeleft < 0){
        clearInterval(downloadTimer);
        document.getElementById("timer").innerHTML = "Time is up!";
        setTimeout(()=>{ //timeout otherwise alert comes before Time is up message
            if(!alert('Game over')){window.location.reload();} //alert + reload page to play again
        },10)  
    }
    }, 1000);

});

