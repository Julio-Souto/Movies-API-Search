import '@picocss/pico'
import './style.css'
import error from './mocks/movies-error.json'
import notfound from './mocks/movies-not-found.json'
import movies from './mocks/movies-search.json'
import viewgrid from './grid-movies.html?raw'

const app = document.querySelector('#app')
const URL = "https://www.omdbapi.com/"
const APIKEY = "?apikey=bb557db"

let uri = URL+""+APIKEY+"&s="

function searchPeliculas(){
  document.getElementById("cargar").setAttribute("aria-busy",true)
  fetch(uri + document.getElementById("search").value.trim())
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    if(data!==null)
      document.querySelector(".grid-movies").innerHTML = cargarPeliculas(data).join("")
    else
      document.querySelector(".grid-movies").innerHTML = `<p>Error desconocido</p>`
    document.getElementById("cargar").removeAttribute("aria-busy")
  })
  .catch((error) => {
    console.log(error)
    document.getElementById("cargar").removeAttribute("aria-busy")
  })
}

async function searchAsync(){
  document.getElementById("cargar").setAttribute("aria-busy",true)
  const response = await fetch(uri + document.getElementById("search").value.trim())
  const data = await response.json()

  if(data!==null)
    document.querySelector(".grid-movies").innerHTML = cargarPeliculas(data).join("")
  else
    document.querySelector(".grid-movies").innerHTML = `<p>Error desconocido</p>`

  document.getElementById("cargar").removeAttribute("aria-busy")
}

function cargarPeliculas(search){
  if(search.Response==="True"){
    const figureElements = search.Search.map((movie) => {
      return `<figure>
        <img src="${movie.Poster}" alt="${movie.Type}">
        <figcaption>${movie.Title}<time>${movie.Year}</time></figcaption>
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
      <h1>Hello Vite!</h1>
      <div id="peliculas">${viewgrid}</div>
    </div>
  `
  document.getElementById("myForm").addEventListener("submit", (e) => {
    e.preventDefault()
  })

  document.getElementById("cargar").addEventListener("click", () => {
    try {
      searchAsync()
    } catch (error) {
      console.log(error)
    } finally{
      
    }
  })

}

mainApp()

// const ejemplo = `
// {
//   "nombre" : "Nombre"
// }`

// console.log(error,JSON.parse(ejemplo))