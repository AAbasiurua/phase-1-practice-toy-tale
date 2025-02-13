let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  // this allows me to toggle the form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
    toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // grab (FETCH) the toys from the API endpoint 
  // render the toys to the DOM
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      // for each toy item in the toys array
      toys.forEach(toy => {
        // render it to the toy card skeleton
        renderToyCard(toy);
      });
    });

  // this is where im creating a new toy
  const addToyForm = document.querySelector('.add-toy-form');
  // listening for the 'submit' on the form
  addToyForm.addEventListener('submit', (event) => {
    // preneting default web settings 
    event.preventDefault();

    // creating name + image variables
    const name = event.target.name.value;
    const image = event.target.image.value;

    // setting/creating newToy object
    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    // grabbing our toys view the API endpoint
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      // setting the newToy data as the body and making it readable
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        renderToyCard(toy);
      });

    // resetting the form so users can input a new toy without having to clear it manually
    addToyForm.reset();
  });
});

// rendering a toy's card to the DOM
function renderToyCard(toy) {
  // grabbing the entire collection
  const toyCollection = document.querySelector("#toy-collection");

  // creating a new toy card + setting a classname 
  const toyCard = document.createElement('div');
  toyCard.className = 'card';

  // creating a new toy name + setting it to be the content
  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;

  // creating a new toy image + adding a source + setting a classname
  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.className = 'toy-avatar';

  // creating a paragraph to display the likes
  // setting the content of that p to render the likes
  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`;

  // dynamically creating a button
  // giving that button a classname 
  // adding an id to our button
  // setting the like button content  
  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.id = toy.id;
  likeButton.textContent = 'Like ❤️';

  // adding all of this to the toy card 
  toyCard.append(toyName, toyImage, toyLikes, likeButton);

  // i want to listen for a click on my like button
  likeButton.addEventListener('click', () => {
    //  passing my toy ID and likes through the function that allows me to create likes
    increaseLikes(toy.id, toyLikes);
  });

  // adding/appending the toy card to my toy collection
  toyCollection.append(toyCard);
}

// this function is letting me increase the likes on each toy
function increaseLikes(toyId, toyLikesElement) {

  // this allows me to just grab the likes integer/number
  const currentLikes = parseInt(toyLikesElement.textContent.split(" ")[0]);
  // creating a counter for the likes
  const updatedLikes = currentLikes + 1;

  // fetching my toy by using the toy id 
  fetch(`http://localhost:3000/toys/${toyId}`, {
    // updating 
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    // making the updated likes data readable + setting it to the body of my object
    body: JSON.stringify({ likes: updatedLikes })
  })
    .then(response => response.json())
    .then(updatedToy => {
      // setting updated toy likes to be the text content of my toy likes portion of the toy card
      toyLikesElement.textContent = `${updatedToy.likes} Likes`;
  });

};