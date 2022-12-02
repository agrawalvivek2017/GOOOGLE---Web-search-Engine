interface SearchResults {
    searchResults: SearchResult[]
}

interface SearchResult {
    url:string;
    title: string;
    description: string;
}

let results=[]
let totalPages = 1;

window.onload = function() {
    let url = decodeURI(document.location.href);
    let params = url.split('?')[1].split('&');
    let data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }
    console.log(data);
    loadInput(data)
    let kwicData = data['KWIC'].replaceAll(",", "\n")
    getSearchResults(kwicData, data['operator'])
}

function loadHomePage() {
    location.assign("index2.html");
}

function loadInput(data){
    let fixedSearch = <HTMLInputElement>document.getElementById('fixedUserSearch');
    if(data['search']) {
        fixedSearch.value = data['search'];
    } else {
        console.log('No field found');
    }
}
let currentPage = 1;

function getBackendUrl(op) {
 if(op == "not") {
    return "http://localhost:8080/query/search/not";
 } else if(op == "or") {
    return "http://localhost:8080/query/search/or";
 } else {
    return "http://localhost:8080/query/search/and";
   }
}

function getSearchResults(data, op) {
    const searchResults = makeRequest<SearchResults>(getBackendUrl(op), 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/json; charset=UTF-8'})
          searchResults.then((resp) => {
            console.log(resp);
            results = resp.searchResults;
            totalPages = Math.max(Math.floor((results.length)/5),1);
            handlePagination()
          }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
          });
}

async function makeRequest<T>(url, method, content, headers): Promise<T> {
    const response = await fetch(url, {
        method: method,
        body: content,
        headers: headers });
    if (response == null ||!response.ok || response.body == null) {
        console.log("Error in making a network call")
    }
    return response.json()
}


function addPageNumbers() {
    let listElement = <HTMLElement>document.getElementById('page-numbers');
    let nextElement = <HTMLElement>document.getElementById('page-next');
    for (let i=1;i<=totalPages;i++) {
        let li = document.createElement('li');
        li.classList.add('page-item');
        li.classList.add('page-link');
        li.value = i;
        li.textContent = i+'';
        li.addEventListener('click', function handleClick() {
            loadResults(i);
        });
        listElement.insertBefore(li, nextElement);
    }
}

function handlePagination() {
   addPageNumbers();
    let previousElement = <HTMLElement>document.getElementById('page-prev');
    if (previousElement) {
        previousElement.addEventListener('click', function handlePrevious(event) {
            if (currentPage > 1) {
                loadResults(currentPage-1);
            } else {
                console.log('Already on page 1');
            }
        });
    }
     let nextElement = <HTMLElement>document.getElementById('page-next');
        if (nextElement) {
            nextElement.addEventListener('click', function handleNext(event) {
                if (totalPages > currentPage) {
                    loadResults(currentPage+1);
                } else {
                    console.log('No more results available');
                }
            });
        }
         loadResults(1);
}

function loadResults(pageNumber) {
    let resultSpace = document.getElementById('search-data');
    clearChildren(resultSpace);
    let previousElement = <HTMLElement>document.getElementById('page-prev');
    let nextElement = <HTMLElement>document.getElementById('page-next');
    let startIndex = pageNumber-1;
    let limt = Math.min(5*pageNumber, results.length);
    for(let i=startIndex*5;i< limt; i++) {
        let res = getSearchElement(results[i]);
        resultSpace.appendChild(res);
        resultSpace.appendChild(document.createElement('br'));
        resultSpace.appendChild(document.createElement('br'));
    }
    currentPage = pageNumber;
    if (currentPage == 1) {
         previousElement.classList.add('disabled');
    } else if (currentPage != 1 && currentPage < totalPages) {
         previousElement.classList.remove('disabled');
    }

    if (currentPage == totalPages) {
        nextElement.classList.add('disabled');
    } else if (currentPage < totalPages && totalPages > 1) {
        nextElement.classList.remove('disabled');
    }
}

function clearChildren(element: Node) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

function getSearchElement(searchResult) {
    const el = document.createElement('div');
    el.classList.add('row')
    el.id = 'search-result';
    const header = document.createElement('h4');
    header.classList.add('row');
    const anchor = document.createElement('a');
    anchor.setAttribute('href', searchResult.url);
    anchor.textContent = searchResult.title;
    anchor.id = 'search-title';
    header.appendChild(anchor);
    el.appendChild(header);
    const span = document.createElement('p');
    span.classList.add('row');
    span.classList.add('ms-1');
    let descText = searchResult.description;
    if (descText.length > 347) {
        descText = descText.substring(0,347) + '...';
    }
    span.textContent = descText;
    el.appendChild(span);
    return el;
}