let API = "http://localhost:8000/todos";
let firstNameInp = document.getElementById("firstName");
let lastNameInp = document.getElementById("lastName");
let phoneNumberInp = document.getElementById("phoneNumber");
let photoFileInp = document.getElementById("photoFile");
let btn = document.querySelector(".btn");
let ul = document.querySelector(".task-list");

const toBase = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

//! Create
btn.addEventListener("click", async () => {
  if (
    !firstNameInp.value.trim() ||
    !lastNameInp.value.trim() ||
    !phoneNumberInp.value.trim() ||
    !photoFileInp.files.length
  ) {
    alert("заполните все поля");
    return;
  }

  let photoUrl = await toBase(photoFileInp.files[0]);

  let newContact = {
    firstName: firstNameInp.value,
    lastName: lastNameInp.value,
    phoneNumber: phoneNumberInp.value,
    photoUrl: photoUrl,
  };

  createContact(newContact);
  readContacts();
  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  photoFileInp.value = "";
});

function createContact(contact) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}

//! READ
function readContacts() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      ul.innerHTML = "";
      data.forEach((elem) => {
        ul.innerHTML += `
                    <li>
                        <img src="${elem.photoUrl}" alt="${elem.firstName} ${elem.lastName}" width="50" height="50">
                        ${elem.firstName} ${elem.lastName} - ${elem.phoneNumber}
                        <button id="${elem.id}" class="btnDelete">Delete</button>
                        <button id="${elem.id}" class="btnEdit">Edit</button>
                    </li>`;
      });
    });
}
readContacts();

//! DELETE
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  let id = e.target.id;
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readContacts());
  }
});

//! EDIT
const editModal = document.querySelector(".editModal");
const editFirstNameInp = document.getElementById("editFirstName");
const editLastNameInp = document.getElementById("editLastName");
const editPhoneNumberInp = document.getElementById("editPhoneNumber");
const btnEditSave = document.querySelector(".btnEditSave");

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  let id = e.target.id;
  if (edit_class.includes("btnEdit")) {
    editModal.style.display = "block";
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        //заполнение полей формы данными контакта
        editFirstNameInp.value = data.firstName.trim();
        editLastNameInp.value = data.lastName.trim();
        editPhoneNumberInp.value = data.phoneNumber.trim();
        //yстановка id контакта в кнопку сохранения
        btnEditSave.setAttribute("data-id", id);
      });
  }
});

btnEditSave.addEventListener("click", (e) => {
  if (
    !editFirstNameInp.value.trim() ||
    !editLastNameInp.value.trim() ||
    !editPhoneNumberInp.value.trim()
  ) {
    alert("введите данные");
    return;
  }
  let editedContact = {
    firstName: editFirstNameInp.value,
    lastName: editLastNameInp.value,
    phoneNumber: editPhoneNumberInp.value,
  };
  editContact(editedContact, btnEditSave.getAttribute("data-id"));
  editModal.style.display = "none";
});

function editContact(newContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(newContact),
  }).then(() => readContacts());
}
