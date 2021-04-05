const { ipcRenderer } = require('electron')
const moment = require('moment');


const toDoForm = document.querySelector('#toDoForm');
const nameToDo = document.querySelector('#nameToDo');
const dateToDo = document.querySelector('#dateToDo');
const descriptionToDo = document.querySelector('#descriptionToDo');
const toDoList = document.querySelector('#toDoList');
const categorySelectOptions = document.querySelector('#category-select')

let updateStatus = false;
let idToDoToUpdate = "";

let listToDos = [];
let categorySelect = [];


ipcRenderer.send('getThingsToDo');
ipcRenderer.send('getCategories');


function renderListToDo(thingsToDo) {
    toDoList.innerHTML = "";
    thingsToDo.map(t => {

        const { thingToDo, category, date, descriptionToDo, _id } = t
        const nameCategory = category ? category.nameCategory : ''
        const beatifulDate = date ? moment(date).format('DD/MM/YYYY, h:mm:ss a') : ''

        toDoList.innerHTML += `
            <div class="card mx-2 mb-2" style="width: 24rem;">
                <div class="card-body">

                    
                    <h5 class="card-title">${thingToDo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${nameCategory}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${beatifulDate}</h6>
                    <p class="card-text">${descriptionToDo}</p>
                    <a href="#" class="btn btn-primary" onclick="editToDo('${_id}')">Edit Thing ToDo</a>
                    <a href="#" class="btn btn-primary" onclick="deleteToDo('${_id}')">Delete Thing ToDo</a>
                </div>
            </div>
        `
    })
}


function renderCategorySelect(categoryAvailables) {
    categorySelectOptions.innerHTML = "<option value=default selected>Open this select menu</option>";
    categoryAvailables.map(t => {
        categorySelectOptions.innerHTML += `
        <option value="${t._id}">
            ${t.nameCategory}
        </option>
        `
    })
}


toDoForm.addEventListener("submit", async e => {

    e.preventDefault();

    const toDo = {
        thingToDo: nameToDo.value,
        date: dateToDo.value,
        descriptionToDo: descriptionToDo.value
    }



    if (categorySelectOptions.value !== 'default') {

        toDo.category = categorySelectOptions.value;
        console.log(toDo)
    }




    if (!updateStatus) {
        ipcRenderer.send('newToDo', toDo);
    } else {
        ipcRenderer.send('update-thingsToDo', {...toDo, idToDoToUpdate })
    }


    toDoForm.reset();
});


ipcRenderer.on('newToDoSuccess', (e, args) => {
    const toDoSaved = JSON.parse(args);

    listToDos.push(toDoSaved);

    renderListToDo(listToDos);
    alert("ToDo Created Successufully");


    nameToDo.focus()

});


function editToDo(id) {
    updateStatus = true;
    idToDoToUpdate = id;
    const toDo = listToDos.find(toDo => toDo._id === id);

    console.log(toDo)

    nameToDo.value = toDo.thingToDo;
    descriptionToDo.value = toDo.descriptionToDo;
    if (toDo.category) {
        categorySelectOptions.value = toDo.category._id
    }

    dateToDo.value = toDo.date.substr(0, 16);

}


function deleteToDo(id) {
    const response = confirm("¿Estás seguro de borrar la tarea?")
    if (response) {
        ipcRenderer.send("deleteThingToDo", id);
    }
    return;
}


ipcRenderer.on('getThingsToDoSuccess', (e, args) => {
    const thingsToDo = JSON.parse(args);
    listToDos = thingsToDo
    renderListToDo(thingsToDo);
});


ipcRenderer.on('getCategoriesSuccess', (e, args) => {

    const categoryAvailables = JSON.parse(args);
    categorySelect = categoryAvailables;
    renderCategorySelect(categorySelect);
});


ipcRenderer.on("updateToDoSuccess", (e, args) => {
    updateStatus = false;



    const updatedToDo = JSON.parse(args);
    console.log(updatedToDo)
    listToDos = listToDos.map((toDo, index) => {
        if (toDo._id === updatedToDo._id)  {
            toDo.thingToDo = updatedToDo.thingToDo;
            toDo.descriptionToDo = updatedToDo.descriptionToDo;
            toDo.category = updatedToDo.category;
            toDo.date = updatedToDo.date;
        }
        return toDo;
    });
    alert("Thing ToDo Updated Successufully");
    renderListToDo(listToDos);

});


ipcRenderer.on("deleteThingToDoSuccess", (e, args) => {


    const deletedToDo = JSON.parse(args);


    const newListToDos = listToDos.filter(toDo => {
        return toDo._id !== deletedToDo._id;
    })
    listToDos = newListToDos;


    renderListToDo(listToDos)
})