import { v4 as uuidv4 } from 'uuid';


let todos = []

// Todos aus dem local Storage laden
const loadTodos = () => {
    const todosJSON = localStorage.getItem('todos')

    try {
        todos = todosJSON ? JSON.parse(todosJSON) : []
    } catch (e) {
        todos = []
    }
}

// Todos im local Storage sichern
const saveTodos = () => localStorage.setItem('todos', JSON.stringify(todos))

// Todo erstellen und dem Array hinzufügen
const createTodo = (text) => {
    const id = uuidv4()

    todos.push({
        id: id,
        text,
        completed: false
    })
    saveTodos()
}

// Todo entfernen
const removeTodo = (id) => {
    // Todo anhand der ID identifizieren
    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
    saveTodos()
}

// Checkbox markieren
const toggleTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id)

    if (todo) {
        todo.completed = !todo.completed
    }
    saveTodos()
}

const generateTodoDOM = (todo) => {
    // Elemente erstellen
    const todoEl = document.createElement('label')
    const containerEl = document.createElement('div')
    const checkbox = document.createElement('input')
    const todoText = document.createElement('span')
    const removeButton = document.createElement('button')

    // Todo checkbox
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = todo.completed
    containerEl.appendChild(checkbox)
    checkbox.addEventListener('change', () => {
        toggleTodo(todo.id)
        renderTodos()
    })

    // Todo text
    todoText.textContent = todo.text
    containerEl.appendChild(todoText)

    // Container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    // Lösch Button
    removeButton.textContent = 'Löschen'
    removeButton.classList.add('button', 'button--text')
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeTodo(todo.id)
        renderTodos()
    })

    return todoEl
}

// Todos im DOM rendern
const renderTodos = () => {
    const todosEl = document.querySelector('#todos')

    todosEl.innerHTML = ''

    if (todos.length > 0) {
        todos.forEach((todo) => todosEl.appendChild(generateTodoDOM(todo)))
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = 'No todos to show'
        todosEl.appendChild(emptyMessage)
    }
}

// Formular Bestätigung 
document.querySelector('#new-todo').addEventListener('submit', (e) => {
    const text = e.target.elements.text.value.trim()
    e.preventDefault()

    if (text.length > 0) {
        createTodo(text)
        renderTodos()
        e.target.elements.text.value = ''
    }
})

loadTodos()
renderTodos()