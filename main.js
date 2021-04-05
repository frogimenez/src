const { BrowserWindow, ipcMain } = require('electron')
const path = require("path")

const Task = require('./models/thingToDo')
const Category = require('./models/category')
const User = require('./models/user')
const bcrypt = require('bcrypt');
const Store = require("electron-store");

const store = new Store()
module.exports.store = store


let ventana;


function createWindow() {
    ventana = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            nodeIntegration: true
        }
    })

    ventana.loadURL(`file://${__dirname}/useri/login.html`)


}



//
//    thingsToDO
//


ipcMain.on("unauthenticate", (event) => {
    ventana.loadURL(`file://${__dirname}/useri/login.html`)
})

ipcMain.on("authenticated", async event => {
    ventana.loadURL(`file://${__dirname}/useri/index.html`)
})

ipcMain.on("newToDo", async(e, args) => {


    args.user = JSON.parse(store.get('currentUser'))
    const newToDo = new Task(args);
    const savedToDo = await newToDo.save().then(t => t.populate('category').execPopulate());

    e.reply("newToDoSuccess", JSON.stringify(savedToDo));
});

ipcMain.on('getThingsToDo', async(e, args) => {

    const thingsToDo = await Task.find({ user: JSON.parse(store.get('currentUser')) }).populate('category');

    e.reply('getThingsToDoSuccess', JSON.stringify(thingsToDo))
})

ipcMain.on('update-thingsToDo', async(e, args) => {

    const updatedThingsToDo = await Task.findByIdAndUpdate(
        args.idToDoToUpdate, { thingToDo: args.thingToDo, descriptionToDo: args.descriptionToDo, category: args.category, date: args.date }, { new: true }
    ).populate('category');
    e.reply("updateToDoSuccess", JSON.stringify(updatedThingsToDo));
})

ipcMain.on("deleteThingToDo", async(e, args) => {
    const toDoDeleted = await Task.findByIdAndDelete(args);
    e.reply("deleteThingToDoSuccess", JSON.stringify(toDoDeleted));
})

//
//    categoryToDO
//


ipcMain.on('newCategory', async(e, args) => {
    args.user = JSON.parse(store.get('currentUser'))
    const newCategory = new Category(args);
    const categorySaved = await newCategory.save();
    console.log(categorySaved);
    e.reply('newCategorySuccess', JSON.stringify(categorySaved))
})

ipcMain.on('getCategories', async(e, args) => {

    const categories = await Category.find({ user: JSON.parse(store.get('currentUser')) });

    e.reply('getCategoriesSuccess', JSON.stringify(categories))
})

ipcMain.on('update-category', async(e, args) => {

    const updatedCategory = await Category.findByIdAndUpdate(
        args.idCategoryUpdate, { nameCategory: args.nameCategory, descriptionCategory: args.descriptionCategory }, { new: true }
    );
    e.reply("updateCategorySuccess", JSON.stringify(updatedCategory));
})

ipcMain.on("deleteCategory", async(e, args) => {
    const deletedCategory = await Category.findByIdAndDelete(args);
    e.reply("deleteCategorySuccess", JSON.stringify(deletedCategory));
})

/**
 * User
 */

ipcMain.on('newUser', async(e, args) => {

    try {
        const newUser = new User(args);
        const userSaved = await newUser.save();
        ventana.loadURL(`file://${__dirname}/useri/login.html`)
    } catch (err) {
        e.reply("createUserError", JSON.stringify(err))
    }
})

ipcMain.on('login', async(e, args) => {

    const user = await User.findOne({ email: args.email },
        (err, usuario) => {

            if (err) { throw err }



            if (!usuario) {
                e.reply("loginUserFailed", "El usuario no es correcto")
            }

            if (usuario) {
                bcrypt.compare(args.password, usuario.password, (err, res) => {
                    if (err || !res) {
                        e.reply("loginUserFailed", "Contraseña no válida")
                    } else {
                        store.set("currentUser", JSON.stringify(user._id))
                        ventana.loadURL(`file://${__dirname}/useri/todos.html`)
                    }
                })
            }


        }

    )


})

module.exports = { createWindow }