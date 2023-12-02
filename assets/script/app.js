'use strict';

// Imports
import { onEvent, select } from './utils.js';
import Contact from './Contact.js';

// Selections
const inputField = select('input');
const btnAdd = select('.btn-add');
const errorMessage = select('.error-message');
const contactContainer = select('.contact-container');
const storageAlertMessage = select('.storage-alert-message');
const savedContacts = select('.saved-contacts');

/* - - - - - - MAIN CODE - - - - - - - */
const contactsArr = [];
let numMaxContacts = 9;

/* - - - - - - Validation - - - - - - - */

// Checks for letters and spaces
let nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

// Checks for letters, extended Latin characters, spaces, dots, hyphens, and apostrophes
let cityRegex = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

// Checks for letters, digits, dots, underscores, hyphens in the local part, and a valid domain
let emailRegex =
  /^(?=.{8,}$)[-_A-Za-z0-9]+([.-_][a-zA-Z0-9]+)*@[A-Za-z0-9]+([.-][a-zA-Z0-9]+)*\.[A-Za-z]{2,}$/;

function validateInput(input) {
  if (input.length === 3) {
    validateName(input[0]);
    validateCity(input[1]);
    validateEmail(input[2]);
    return !errorMessage.innerText;
  } else {
    errorMessage.innerText =
      'Please enter all the specified inputs (name, city, email)';
    return false;
  }
}

function validateName(name) {
  let inputName = name.trim();
  if (!nameRegex.test(inputName))
    errorMessage.innerText = 'Please enter a valid name';
}

function validateCity(city) {
  let inputCity = city.trim();
  if (!cityRegex.test(inputCity))
    errorMessage.innerText = 'Please enter a valid city';
}

function validateEmail(email) {
  let inputEmail = email.trim();
  if (!emailRegex.test(inputEmail))
    errorMessage.innerText = 'Please enter a valid email';
}

/* - - - - - - Create a new Contact - - - - - - - */
function createContact(input) {
  const newContact = new Contact(
    input[0].trim(),
    input[1].trim(),
    input[2].trim()
  );
  contactsArr.unshift(newContact);
}

/* - - - - - - Display the contacts - - - - - - - */
function listContacts() {
  storageAlertMessage.innerText = '';

  if (contactsArr.length <= numMaxContacts) {
    contactContainer.innerHTML = '';

    contactsArr.forEach((contact, index) => {
      const contactDiv = document.createElement('div');
      contactDiv.classList.add('contact-info');

      // Create paragraphs
      const paraName = document.createElement('p');
      const paraCity = document.createElement('p');
      const paraEmail = document.createElement('p');

      // Add object's data to the paragraphs
      paraName.innerText = `Name: ${contact.name}`;
      paraCity.innerText = `City: ${contact.city}`;
      paraEmail.innerText = `Email: ${contact.email}`;

      // Append the paragraphs to the contactsDiv
      contactDiv.appendChild(paraName);
      contactDiv.appendChild(paraCity);
      contactDiv.appendChild(paraEmail);

      // Add contactsDiv to the HTML
      contactContainer.appendChild(contactDiv);

      // Delete the contacts
      onEvent('click', contactDiv, () => {
        contactsArr.splice(index, 1);
        listContacts();
      });
    });
    // Display the number of saved contacts
    savedContacts.innerText = `Saved contacts: ${contactsArr.length}`;
  } else {
    storageAlertMessage.innerText =
      'Storage is full! Cannot add more contacts :(';
  }
}

/* - - - - - - Events - - - - - - - */
onEvent('click', btnAdd, event => {
  event.preventDefault();

  let userInput = inputField.value.split(',');

  // Clear the error message
  errorMessage.innerText = '';

  // Return early if the validation fails
  if (!validateInput(userInput)) return;

  // Create contact
  createContact(userInput);

  // Display contact
  listContacts();

  // Clear the input fields
  inputField.value = '';
});
