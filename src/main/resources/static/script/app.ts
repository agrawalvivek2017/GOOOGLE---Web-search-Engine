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

function performShuffle() {
    let userInput = <HTMLInputElement>document.getElementById('inputArea');
    let shuffleArea = <HTMLInputElement>document.getElementById('shuffledWords');
    if (userInput && shuffleArea) {
        var data = userInput.value;
        if (data == null || data == '') {
            shuffleArea.value=''
        }
        const saveResponse = makePlainRequest("http://localhost:8080/query/saveInput", 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/text; charset=UTF-8'})
        saveResponse.then((resp) => {
            console.log(resp);
          }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
          });
          const shuffleResponse = makeRequest<ShuffledResponse>("http://localhost:8080/query/getCircularShiftedLine", 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/json; charset=UTF-8'})
          shuffleResponse.then((resp) => {
            console.log(resp);
            shuffleArea.value = extractAndDisplayShiftedLines(resp);
          }).catch((err) => {
            console.log(err); // 👉️ "An error occurred"
          });
    }
}

function performSort() {
    let shuffledInput = <HTMLInputElement>document.getElementById('shuffledWords');
    let sortedArea = <HTMLInputElement>document.getElementById('sortedSentence');
    if (shuffledInput && sortedArea) {
        var data = shuffledInput.value;
        if (data == null || data == '') {
            sortedArea.value=''
        }
        const sortedResponse = makeRequest<AlphabetizedResponse>("http://localhost:8080/query/alphabetize", 'POST', data, {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "POST, GET,OPTIONS " , "Access-Control-Allow-Headers": "X-PINGOTHER",'Content-Type': 'application/json; charset=UTF-8'})
        sortedResponse.then((resp) => {
            console.log(resp);
            sortedArea.value = displayAlphabetizedResponse(resp);
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
        result += sortedSentences[i].line + '\n';
    }
    return result;
}