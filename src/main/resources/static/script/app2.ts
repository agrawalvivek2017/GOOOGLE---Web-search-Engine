interface ShuffledResponse {
    shuffledInput: CircularShiftObj[];
    inputLine: Sentence
}
interface CircularShiftObj {
 circularShiftedLines: Sentence[]
}

interface AlphabetizedResponse {
    sortedLines: Sentence[]
}

interface Sentence {
    line: string;
    words: string[];
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

async function makePlainRequest(url, method, content, headers) {
    const response = await fetch(url, {
        method: method,
        body: content,
        headers: headers });
    if (response == null ||!response.ok || response.body == null) {
        console.log("Error in making a network call")
    }
    return response.text()
}
 let url = '';
 function performSearch() {
    let userInput = <HTMLInputElement>document.getElementById('inputArea');
    performShuffle(userInput)
     url = "page2.html?search="+userInput.value;
     let operator = <HTMLInputElement>document.getElementById('operator');
     let op = operator.value;
     console.log('selected value ='+ op);
     url += "&operator="+ op;
//      location.assign(url)
 }

function performShuffle(userInput) {
//     let dropdown = <HTMLInputElement>document.getElementById('dropdownSearch');
    if (userInput) {
        var data = userInput.value;
        if (data == null || data == '') {
            userInput.value=''
        }
//         console.log(dropdown.value)
        const saveResponse = makePlainRequest("http://localhost:8080/query/saveInput", 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/text; charset=UTF-8'})
        saveResponse.then((resp) => {
            console.log(resp);
          }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
          });
          const shuffleResponse = makeRequest<ShuffledResponse>("http://localhost:8080/query/getCircularShiftedLine", 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/json; charset=UTF-8'})
          shuffleResponse.then((resp) => {
            console.log(resp);
            const lines = extractAndDisplayShiftedLines(resp);
            performSort(lines)
          }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
          });
    }
}

function performSort(lines) {
    if (lines) {
        const sortedResponse = makeRequest<AlphabetizedResponse>("http://localhost:8080/query/alpha-eliminate-noise", 'POST', lines, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/json; charset=UTF-8'})
        sortedResponse.then((resp) => {
            console.log('AlphabetizedResponse='+resp);
            const sortedLines = displayAlphabetizedResponse(resp);
            console.log('FinalKWIC='+ sortedLines)
            url = url + '&KWIC='+ sortedLines;
            location.assign(url);
        }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
        });
    }
}

function extractAndDisplayShiftedLines(response:ShuffledResponse) {
    let result = ''
    let circularShiftedSentences = response.shuffledInput
    for(let i=0;i<circularShiftedSentences.length;i++) {
        let lines = circularShiftedSentences[i].circularShiftedLines;
        for (let j=0;j< lines.length;j++) {
            result += lines[j].line + '\n';
        }
    }
    return result;
}


function displayAlphabetizedResponse(alphabetizedLines: AlphabetizedResponse) {
    let sortedSentences: Sentence[] = alphabetizedLines.sortedLines;
    let result = ''
    for(let i=0;i<sortedSentences.length;i++) {
        result += sortedSentences[i].line;
         if (i != sortedSentences.length-1) {
           result+= ",\n";
         }

    }
    return result;
}