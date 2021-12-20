function initTodo() {
    showTodosToday();
    showTodosAll();
}

let isEditing = false;
let editIndex;

/** Activates the buttons when user enters values */
function validateInput() {
    const inputBox = document.querySelector(".inputField input");
    const dateBox = document.querySelector(".todo-date");
    const addBtn = document.querySelector(".inputField button");
    let userData = inputBox.value;
    let dateData = new Date(dateBox.value); 
    let minDate = new Date(dateBox.min); 
    if (userData.trim() != 0 && dateData >= minDate ) {
        addBtn.classList.add("active");
    } else {
        addBtn.classList.remove("active");
    }
}

/** Pushes user data to list and inactivates the submit button */
function createTodo() {
    const inputBox = document.querySelector(".inputField input");
    const dateBox = document.querySelector(".todo-date");
    const addBtn = document.querySelector(".inputField button");
    let todoArr = getTodoList();
    let userData = inputBox.value; 
    let dateData = dateBox.value; 

    if (isEditing) {
        todoArr.splice(editIndex, 1);
        isEditing = false;
    }

    todoArr.push({ description: userData, date: dateData }); 
    localStorage.setItem("New Todo", JSON.stringify(todoArr)); 
    showTodosAll(); 
    showTodosToday();
    showNoOfTodosOnCalendar();
    addBtn.classList.remove("active");
}

/**
* Set the 'Enter' key to call the same function as 'Send' pressed
* @param {KeyboardEvent} event
*/
function pressedEnter(event) {
    const inputBox = document.querySelector(".inputField input");
    if (event.keyCode === 13) {
        if (inputBox.value == "") {
            return false;
        }
        createTodo();
    }
}

/** Retrieve data from localstorage */
function getTodoList() {
    let getLocalStorage = localStorage.getItem("New Todo");
    if (getLocalStorage === null) {
        todoArr = [];
    } else{
        todoArr = JSON.parse(getLocalStorage); 
    }
    return todoArr;
}

/** Adds new li element under todays todos, when todo is added user leaves input and button inactivates */
function showTodosToday() {
    let todoArr = getTodoList();
    const todoListToday = document.querySelector(".todoList-today");
    const pendingNumber = document.querySelector(".pendingNumber");
    const inputBox = document.querySelector(".inputField input");
    const dateBox = document.querySelector(".todo-date");
    const deleteAllTodaysTodoBtn = document.querySelector(".footer button");

    let newLiTag = '';
    const filter = todoArr.filter(element => { return new Date(element.date).toDateString() == new Date().toDateString() });
    filter.forEach((todoItem) => {
        const indexInAll = todoArr.indexOf(todoItem);
        newLiTag += `<li>${todoItem.description}<span class="edit" onclick="editTask(${indexInAll})";><i class="fas fa-edit"></i></span>  <span class="trash" onclick="deleteTask(${indexInAll})";><i class="fas fa-trash"></i></span></li>`
    });
    todoListToday.innerHTML = newLiTag; 
    inputBox.value = ""; 
    dateBox.value = "";

    pendingNumber.textContent = filter.length;
    if (filter.length > 0) { 
        deleteAllTodaysTodoBtn.classList.add("active"); 
    } else {
        deleteAllTodaysTodoBtn.classList.remove("active");
    }
}

/**
 * Selects the date that the user press, filter the todos and adds new li tag inside ul tag
 * @param {String} selectedDate 
 */
function showTodosSelectedDate(selectedDate) {
    let todoArr = getTodoList();
    const todoListSelected = document.querySelector('.todoList-selected');
    const todoListTitle = document.querySelector('.selected');

    let newLiTag = '';
    const filter = todoArr.filter(element => { return new Date(element.date).toDateString() == new Date(selectedDate).toDateString() });
    filter.forEach((todoItem) => {
        const indexInAll = todoArr.indexOf(todoItem);
        newLiTag += `<li>${todoItem.description}<span class="edit" onclick="editTask(${indexInAll})";><i class="fas fa-edit"></i></span>  <span class="trash" onclick="deleteTask(${indexInAll})";><i class="fas fa-trash"></i></span></li>`
    });
    todoListTitle.innerHTML = new Date(selectedDate).toDateString();
    todoListSelected.innerHTML = newLiTag; 

    let icon = todoListTitle.nextElementSibling;
    if (filter.length > 0) { 
        icon.classList.remove("disable");
        toggleTodo(event);
        console.log('1');
    } else {  // else if (filter.length === 0) 
        icon.classList.add("disable");
        console.log('2');
    }
    
    if (todoListTitle.innerHTML !== 'Selected Date') {
        todoListTitle.innerHTML == 'Selected Date';
        if (filter.length === 0);
    }
}

/** Adds new li element under all todos, when todo is added user leaves input and button unactivates */
function showTodosAll() {
    const inputBox = document.querySelector(".inputField input");
    const todoList = document.querySelector(".todoList-all");
    let todoArr = getTodoList();
    let newLiTag = '';
    todoArr.forEach((element, index) => {
        newLiTag += `<li>${element.description}<p class="date-display">${element.date}</p><span class="edit" onclick="editTask(${index})";><i class="fas fa-edit"></i></span> <span class="trash" onclick="deleteTask(${index})";><i class="fas fa-trash"></i></span></li>`
    });
    todoList.innerHTML = newLiTag; 
    inputBox.value = ""; 
}

/**
 * Deletes particular todo and updates local storage 
 * @param {Number} index 
 */
 function deleteTask(index) {
    let getLocalStorage = localStorage.getItem("New Todo");
    todoArr = getTodoList();
    todoArr.splice(index, 1); 
    localStorage.setItem("New Todo", JSON.stringify(todoArr));
    showTodosAll(); 
    showTodosToday();
    showTodosSelectedDate(); 
    showNoOfTodosOnCalendar();
}

/**
 * Pushes inputBox and dateBox value back to input and replaces with new value
 * @param {Number} index 
 */
 function editTask(index) {
    const inputBox = document.querySelector(".inputField input");
    const dateBox = document.querySelector(".todo-date");
    let todoArr = getTodoList();
    inputBox.value = todoArr[index].description;
    dateBox.value = todoArr[index].date;
    isEditing = true;
    editIndex = index;
    localStorage.setItem("New Todo", JSON.stringify(todoArr));
    dateBox.scrollIntoView();
    validateInput();
    showNoOfTodosOnCalendar();
}

/** Deletes all todos and updates local storage */
function deleteAllTodaysTodo() {
    let todoArr = getTodoList();
    const filter = todoArr.filter(element => { return new Date(element.date).toDateString() !== new Date().toDateString() });
    todoArr = filter;
    localStorage.setItem("New Todo", JSON.stringify(todoArr));
    showTodosToday(); 
    showTodosAll();
    showNoOfTodosOnCalendar();
}
