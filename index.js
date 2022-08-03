const top250 = "https://api.wmdb.tv/api/v1/top?type=Imdb&skip=0&limit=250&lang=Cn"
const SearchApi = " https://api.wmdb.tv/api/v1/movie/search?q="
const SearchEl = document.getElementById("search")
const form = document.getElementById("form")
const loading = document.querySelector(".loading-mask")

form.addEventListener("submit",(e)=>{
  e.preventDefault()
  throttleSearch(e)
  
})

const throttleSearch = throttle(searchMovie,30000 ,"抱歉，30s内仅能调用一次")

function throttle(fn,time ,msg){
  let start = 0
  return function(e){
    const timeSpan = Date.now() - start
    if (timeSpan < time) {
      setMessage(msg,"error")
    }else{
      start = Date.now()
      fn.call(this,e)
    }
  }
}
function searchMovie(e){
  // const searchValue = SearchEl.value
  const searchValue = e.target[0].value
  if (searchValue && searchValue !== '') {
    const FinalSearchApi = SearchApi + searchValue
    getMovies(FinalSearchApi,true)
    SearchEl.value = ''
  }else{
    window.location.reload()
  }
}

async function getMovies(url,isSearch){
  loading.classList.remove("hideLoading")
  const res = await fetch(url).catch(()=>{
    setMessage("服务器出错了",'error')
    loading.classList.add("hideLoading")
  });
  //console.log(res)
  if (res) {
    const result = await res.json() 
    loading.classList.add("hideLoading")
  if (isSearch) {
    
   setMessage('搜索成功','success')
  
  }
 
   //console.log(result)
  showMovies(result)
  }

}

function showMovies(movies){
  const main = document.querySelector("#main")
  main.innerHTML = ""
  movies.forEach(movie => {
    // console.log(movie)
    const movieEl = document.createElement("div")
    movieEl.classList.add('movie')
    movieEl.innerHTML = `
    <div class="img-container">
          <img src="${movie.data[0].poster}" alt="">
        </div>
        <div class="movie-info">
          <h3>${movie.data[0].name}</h3>
          <span class="${getClassByRate(movie.doubanRating)}">${movie.doubanRating}</span>
        </div>
        <div class="overview">
          <h3>概览</h3>
          <div class="text">
            ${movie.data[0].description}
          </div>
        </div>
    `
    main.appendChild(movieEl)
  });
}

function getClassByRate(vote){
  if (vote>=9) {
    return "green"
  }else if(vote>=8){
    return "orange"
  }else{
    return "red"
  }
}

//消息设置
const msgContainer = document.querySelector(".message")
function setMessage(text,type){
  if(!text) return 
  const p = document.createElement("p")
  p.textContent = text
  if (type === "success") {
    p.classList.add("success")
  }else{
    p.classList.add("error")
  }
  msgContainer.appendChild(p)
  setTimeout(()=>{
    p.remove()
  },5000)
}

/* function searchMovies(keyword){
  
} */
getMovies(top250)

