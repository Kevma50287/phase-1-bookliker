document.addEventListener("DOMContentLoaded", function() {
    //grab elements
    const url = 'http://localhost:3000/books'
    const ulList = document.getElementById('list')
    const display = document.getElementById('show-panel')
    const currUser = document.createElement('p')
    const newForm = document.createElement('form')
    let UserObj = {}

    fetch('http://localhost:3000/users')
    .then(res=>res.json())
    .then(data => {
        data.forEach((element)=>{
            let elementID = element.id
            let elementuser = element.username
            UserObj[`${elementuser}`] = elementID
        })
    });

    //current user
    currUser.textContent='pouros'
    let currID = 1
    let bookID = 0

    //create user button to switch users
    let userbtn = document.createElement('input')
    userbtn.type = 'submit'
    userbtn.textContent = 'Change User'


    //create input field that contains new user
    let userInput = document.createElement('input')
    userInput.type = 'text'
    userInput.placeholder = 'Enter a user'
    userInput.name = 'username'
    userInput.id = 'username'


    //append the buttons, curent user, and input field to form
    newForm.append(currUser, userbtn, userInput)

    //append form to the body
    document.querySelector('body').append(newForm)

    //add eventlistener to the form
    newForm.addEventListener('submit', (e) => {
        e.preventDefault()
        //only switches user if the input isn't empty
        if (e.target.username.value !== ''){
            switchUser(e)
        } else { //otherwise we alert the browser/user
            alert('Please enter a username')
        }

        newForm.reset()
    });

    //switchUser function
    const switchUser = (e) => {
        currUser.textContent = e.target.username.value

        if (currUser.textContent in UserObj){
            currID = UserObj[currUser.textContent]
            console.log(UserObj[currUser.textContent])
        } else {
            fetch('http://localhost:3000/users',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    username:currUser.textContent
                })
            })
            .then(res=>res.json())
            .then(data => {
                UserObj[`${data.username}`] = data.id;
                currID = data.id
            })
        };

        console.log(UserObj, currID)
    };


    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        //renders all the elements
        data.forEach(element => {
            let li = document.createElement('li')
            li.textContent = element.title
            li.addEventListener('click', (e) => handleDisplay(e, element))
            ulList.append(li)
        });
    });


    const handleDisplay = (e, element) => {
        bookID = element.id
        let img = document.createElement('img')
        let p = document.createElement('p')
        let ul = document.createElement('ul')
        ul.id = 'likeUsers'
        let likebtn = document.createElement('button')

        likebtn.textContent = 'Like ❤'
        likebtn.addEventListener('click', (e) => patchIt(e, element))
        
        img.src=element['img_url']
        p.textContent = element.description

        element.users.forEach((person) => {
            let userli = document.createElement('li')
            userli.textContent = person.username
            ul.append(userli)
            console.log(person)
        })

        while (display.firstChild){
            display.firstChild.remove()
        }

        display.append(img, p, ul, likebtn)
    };

    const patchIt = (e, element) => {
        let currlikeArr = element.users
        let currIDList = []
        let newLiker = {
            id: currID,
            username: currUser.textContent
        }

        //assign each ID to an array - if currID in array, remove and patch
        //if not in array add and patch
        currlikeArr.forEach((InArr) => {
            currIDList.push(InArr.id)
        })


        // if (currIDList.includes(currID)){

        // }

        console.log(currlikeArr)
        //to get the new username on the display without refreshing/clicking
        let newli = document.createElement('li')
        newli.textContent = currUser.textContent
        document.getElementById('likeUsers').append(newli)

        //add newLike to the array
        currlikeArr.push(newLiker)
        console.log(currlikeArr)
        let patchObj = {
            method:'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                users: currlikeArr
            })
        };

        fetch(`${url}/${element.id}`, patchObj)
    
        if
    };
    
});

// When a user clicks the title of a book, display the book's 
// thumbnail, description, and a list of users who have liked the book. 
// This information should be displayed in the div#show-panel element.