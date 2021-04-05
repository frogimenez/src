const { ipcRenderer } = require("electron")

const categoryForm = document.querySelector("#categoryForm");
const categoryName = document.querySelector("#categoryName");
const categoryDescription = document.querySelector("#categoryDescription");
const categoryList = document.querySelector("#categoryList")

let updateStatus = false;
let idCategoryUpdate = "";


let categories = [];



function renderCategory(categories) {
    categoryList.innerHTML = "";
    categories.map(c => {

        const { nameCategory, descriptionCategory, _id } = c

        const description = descriptionCategory ? descriptionCategory : '';

        categoryList.innerHTML += `

            <div class="card mx-2 mb-2" style="width: 24rem;">
                <div class="card-body">

                
                    <h5 class="card-title">${nameCategory}</h5>
                    <p class="card-text">${description}</p>
                    <a href="#" class="btn btn-primary" onclick="editCategory('${_id}')">Edit Category</a>
                    <a href="#" class="btn btn-primary" onclick="deleteCategory('${_id}')">Delete Category</a>
                </div>
            </div>
        `
    })
}

categoryForm.addEventListener('submit', async e => {
    e.preventDefault();
    const category = {
        nameCategory: categoryName.value,
        descriptionCategory: categoryDescription.value
    }
    if (!updateStatus) {
        ipcRenderer.send('newCategory', category)

    } else {
        ipcRenderer.send('update-category', {...category, idCategoryUpdate })
    }
    categoryForm.reset();
})


ipcRenderer.send('getCategories');


ipcRenderer.on('getCategoriesSuccess', (e, args) => {
    const categoriesList = JSON.parse(args);
    categories = categoriesList
    renderCategory(categories);
});




ipcRenderer.on('newCategorySuccess', (e, args) => {
    const categorySaved = JSON.parse(args);

    categories.push(categorySaved);

    renderCategory(categories);
    alert("Category Created Successufully");


    categoryName.focus()

});


ipcRenderer.on("updateCategorySuccess", (e, args) => {
    updateStatus = false;
    const updatedCategory = JSON.parse(args);
    categories = categories.map((category, index) => {
        if (category._id === updatedCategory._id)  {
            category.nameCategory = updatedCategory.nameCategory;
            category.descriptionCategory = updatedCategory.descriptionCategory;
        }
        return category;
    });
    alert("Category Updated Successufully");
    renderCategory(categories);

})


ipcRenderer.on("deleteCategorySuccess", (e, args) => {


    const deletedCategory = JSON.parse(args);


    const newListCategories = categories.filter(category => {
        return category._id !== deletedCategory._id;
    })
    categories = newListCategories;


    renderCategory(categories)
})





function editCategory(id) {
    updateStatus = true;
    idCategoryUpdate = id;
    const updateCategory = categories.find(category => category._id === id);
    categoryName.value = updateCategory.nameCategory;
    categoryDescription.value = updateCategory.descriptionCategory;

}


function deleteCategory(id) {
    const response = confirm("¿Estás seguro de borrar la categoría?")
    if (response) {
        ipcRenderer.send("deleteCategory", id);
    }
    return;
}