import './node_modules/@picocss/pico'
import './style.css'
import debounce from 'just-debounce-it'
import error from './mocks/movies-error.json'
import notfound from './mocks/movies-not-found.json'
import movies from './mocks/movies-search.json'
import viewgrid from './grid-movies.html?raw'

const app = document.querySelector('#app')
const URL = "https://www.omdbapi.com/"
const APIKEY = "?apikey=bb557db"
let content = null
let button = null
let siguiente = null
let form = null
let page = 1
let totalPages = 1

let uri = URL+""+APIKEY+"&s="

function searchPeliculas(){
  button.setAttribute("aria-busy",true)
  fetch(uri + document.getElementById("search").value.trim())
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    if(data!==null)
      content.innerHTML = cargarPeliculas(data).join("")
    else
      content.innerHTML = `<p>Error desconocido</p>`
    button.removeAttribute("aria-busy")
  })
  .catch((error) => {
    console.log(error)
    button.removeAttribute("aria-busy")
  })
}

async function searchAsync(){
  page=1
  button.setAttribute("aria-busy",true)
  const response = await fetch(uri + document.getElementById("search").value.trim())
  const data = await response.json()

  if(data!==null)
    content.innerHTML = cargarPeliculas(data).join("")
  else
    content.innerHTML = `<p>Error desconocido</p>`

  button.removeAttribute("aria-busy")
}

async function nextPage(pages){
  siguiente.setAttribute("aria-busy",true)
  anterior.setAttribute("aria-busy",true)
  const response = await fetch(uri + document.getElementById("search").value.trim()+"&page="+pages)
  const data = await response.json()

  if(data!==null)
    content.innerHTML = cargarPeliculas(data).join("")
  else
    content.innerHTML = `<p>Error desconocido</p>`

  siguiente.removeAttribute("aria-busy")
  anterior.removeAttribute("aria-busy")
}

function cargarPeliculas(search){
  if(search.Response==="True"){
    if(search.totalResults>10)
      totalPages=Math.ceil(Number(search.totalResults)/10)
    else
      totalPages = 1
    document.getElementById("totalPages").innerHTML = page+"/"+totalPages
    const figureElements = search.Search.map((movie) => {
      return `<figure>
        <img src="${movie.Poster}" alt="${movie.Type}">
        <figcaption>${movie.Title}<time> ${movie.Year}</time></figcaption>
      </figure>`
    })
    return figureElements
  }
  else{
    return [`<p>${search.Error}</p>`,`<p>${search.Response}</p>`]
  }
}

function mainApp(){
  if(!app)
    throw new Error("No existe elemento raiz")

  app.innerHTML = `
    <div class="container">
      <div id="peliculas">
      <h1>Buscador de peliculas</h1>
      ${viewgrid}
      </div>
    </div>
  `
  content = document.querySelector(".grid-movies")
  button = document.getElementById("cargar")
  siguiente = document.getElementById("siguiente")
  anterior = document.getElementById("anterior")
  form = document.getElementById("myForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()
  })

  const d1 = debounce(() => {
    searchAsync()
  },300)

  form.addEventListener("input", d1)

  button.addEventListener("click", () => {
    try {
      let id
      clearTimeout(id)
      id = setTimeout(() => {
        searchAsync()
      },300)
    } catch (error) {
      console.log(error)
    } finally{
      
    }
  })
  siguiente.addEventListener("click", () => {
    try {
      if(page<totalPages)
        nextPage(++page)
      console.log(page)
    } catch (error) {
      console.log(error)
    }
  })
  anterior.addEventListener("click", () => {
    try {
      if(page>1)
        nextPage(--page)
      console.log(page)
    } catch (error) {
      console.log(error)
    }
  })
}

mainApp()

// const ejemplo = `
// {
//   "nombre" : "Nombre"
// }`

// console.log(error,JSON.parse(ejemplo))