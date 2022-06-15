const url = "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs";
const wrapper = document.querySelector(".wrapper");
const sourceList = document.querySelector(".source-list");
const tbodyScroll = document.querySelector(".tbody-scroll");
const formSubmit = document.querySelector(".form-submit");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const btnFisrt = document.querySelector(".btn-fisrt");
const btnLast = document.querySelector(".btn-last");
let updateId = null;
//Render
let currentPage = 1;
let perPage = 10;
let start = 0;
let end = perPage;
let totalPage

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr =  new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    if(data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onload = () => {
      if(xhr.status >= 400 && xhr.status == 204) {
        reject(xhr.response);
      }else {
        resolve(xhr.response);
      }
    };
    xhr.onerror = () => {
      reject('loi')
    }
    xhr.send(JSON.stringify(data));
  });
  return promise;
};
// PUT
 function updateSource({ id, title, createdAt, image, content }) {
   sendHttpRequest('PUT', `${url}/${id}`, { id,title, createdAt, image, content })
}
// Post
 function addPost({ id, title, createdAt, image, content }) {
   sendHttpRequest('POST', url, { id, title, createdAt, image, content});
}
//Delete
 function deleteSource(id) {
   sendHttpRequest('DELETE', `${url}/${id}`);
}

async function getSingleSource(id) {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  return data;
}

function toApi() {
  getBlog(function(blogs) {
      getSource(blogs);
      fresherItem (blogs);
      nextPage(blogs);
      prevPage(blogs);
      fistPage(blogs);
      lastPage(blogs);
  })
}
function getBlog(callback) {
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(callback)
        .catch(function(error) {
            console.log(error);
        })
        .finally(function() {

        })
        console.log(callback);
}
//Delete
function deleteApi() {
  tbodyScroll.addEventListener("click", async function (e) { 
    if (e.target.matches(".source-remove")) {
      const id = e.target.dataset.id;
      deleteSource(id);
    }  
  });
}
// edit
function putApi() {
  tbodyScroll.addEventListener("click", async function (e) {
    if (e.target.matches(".source-edit")) {
      const id = e.target.dataset.id;
      const data = await getSingleSource(id);
      console.log(data);
      wrapper.elements["id"].value = data.id;
      wrapper.elements["title"].value = data.title;
      wrapper.elements["createdAt"].value = data.createdAt;
      wrapper.elements["image"].value = data.id;
      wrapper.elements["content"].value = data.id;
      formSubmit.textContent = "Update";
      updateId = id;
    }
    getBlog()
  })
}


// Submit
function postApi() {
  wrapper.addEventListener("submit",  function (e) {
    e.preventDefault();
    const source = {
      id: this.elements["id"].value,
      title: this.elements["title"].value,
      createdAt: this.elements["createdAt"].value,
      image: this.elements["image"].value,
      content: this.elements["content"].value,
    };
      updateId
        ?  updateSource({ id: updateId, ...source })
        :  addPost(source);
        this.reset();
      });
}


function getSource(blogs) {
  let product = document.getElementById('product');
  let productItem = '';
  blogs.forEach(function(blog, index) {
    let { id, title, content, createdAt, image } = blog;
        let date = new Date(createdAt);
        let dateFull = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes()
            product.map
        if (index >= start && index < end) {
          productItem += ` 
              <tr class="trbody">
              <td>${id}</td>
              <td>${title}</td>
              <td>${dateFull}</td>
              <td>${image}</td>
              <td>${content}
              <button class="source-edit" data-id = ${id}> <i class="fa fa-list-alt"></i></button>
              <button class="source-remove" data-id = ${id}><i class="fa fa-times"></i></button>
              </td>
            </tr> `
        }
        product.innerHTML = productItem;
})
}
//Pagination
function getCurrentPage(currentPage) {
  start = (currentPage - 1) * perPage
  end = currentPage * perPage;
}

let numberPage = document.getElementById('number-page');
numberPage.innerHTML = `<p>${currentPage}</p>`;

function fresherItem(blogs) {
  let myInput = document.getElementById('myInput');
  myInput.onchange = function() {
      let myInputValue = document.getElementById('myInput').value;
      perPage = myInputValue;
      currentPage =1;
      numberPage.innerHTML = `<p>${currentPage}</p>`
      getCurrentPage(currentPage)
      getSource(blogs)
  }
}
// click Next
function nextPage(blogs) {
  btnNext.addEventListener('click', function() {
      totalPage = Math.round(Math.ceil(blogs.length) / perPage);
      if (currentPage >= totalPage) {
          currentPage = totalPage;
          numberPage.innerHTML = `<p>${currentPage}</p>`
          getCurrentPage(currentPage)
          btnNext.classList.add('activeFilter')
          getSource(blogs)
        }else {
          currentPage++;
          numberPage.innerHTML = `<p>${currentPage}</p>`
          getCurrentPage(currentPage)
          btnPrev.classList.remove('activeFilter')
          getSource(blogs)
      }    
  })
}
// Click Prev
function prevPage(blogs) {
  btnPrev.addEventListener('click', function() {
      if (currentPage <= 1) {
          currentPage = 1;
          getCurrentPage(currentPage)
          btnPrev.classList.add('activeFilter')
          getSource(blogs)
      }else {
          currentPage--;
          numberPage.innerHTML = `<p>${currentPage}</p>`
          getCurrentPage(currentPage) 
          btnNext.classList.remove('activeFilter')
          getSource(blogs)
         
      }
  })
}
// Next fistPage
function fistPage(blogs) {
  btnFisrt.addEventListener('click', function() {
      currentPage = 1;
      numberPage.innerHTML = `<p>${currentPage}</p>`
      getCurrentPage(currentPage)
      btnNext.classList.remove('activeFilter')
      btnPrev.classList.add('activeFilter')
      getSource(blogs)
  })
}
// click LastPage
function lastPage(blogs) {
  btnLast.addEventListener('click', function() {
      totalPage = Math.round(Math.ceil(blogs.length) / perPage);
      currentPage = totalPage;
      numberPage.innerHTML = `<p>${currentPage}</p>`
      getCurrentPage(currentPage)
      btnNext.classList.add('activeFilter')
      btnPrev.classList.remove('activeFilter')
      btnPrev.classList.remove('activeFilter')
      getSource(blogs)
  })
}
export {toApi, postApi,putApi,deleteApi};