
const colors = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark"];

class Trie {
    constructor() {
        this.children = {};
        this.end = false;
        this.color = ""; // for styling
    }

    delete(event, word) {        
        let node = this;
        for (let letter of word) {
            if (letter in node.children) node = node.children[letter];
            else return // word not found, nothing to delete
        }
        node.end = false; // soft delete
        search(event);
    }

    insert(word) {
        let node = this;
        for (let letter of word) {
            if (!(letter in node.children)) node.children[letter] = new Trie();
            node = node.children[letter];
        }
        node.end = true;
        node.color = colors[parseInt(Math.random()*colors.length)];
    }

    find(prefix) {
        // find prefix end node
        let pnode = this; // find and store prefix end node
        for (let letter of prefix) {
            if (letter in pnode.children) pnode = pnode.children[letter];
            else return [];
        }        
        
        // find all words
        function dfs(node, word) {
            let words = [];
            if (node.end) words.push( { word: word, color: node.color } );            
            for (let key in node.children) {
                words = words.concat(dfs(node.children[key], word + key));
            };
            return words;
        }    
        
        return dfs(pnode, prefix).sort((f, s) => f.word > s.word ? 1 : -1);
    }
}

const trie = new Trie();
const searchId = "search";

// Add some default words
window.onload = event => {     
    trie.insert("apple");
    trie.insert("trie");
    trie.insert("cat")
    trie.insert("bat");    
    search(event);    
}

function add(event) {    
    event.preventDefault();
    let element = document.getElementById('wordin');
    
    let word = element.value.trim().toLowerCase();
    element.value = '';
    if (word.length == 0) return;
    
    trie.insert(word);
    search(event);    
};


function remove(event) {
    event.preventDefault();    
    
    trie.delete(event, document.getElementById(event.target.id).textContent);
    search(event);    
}


Math.random
function search(event) {
    event.preventDefault();
    document.getElementById('wordlist').innerHTML = '';

    let text = document.getElementById(searchId).value.toLowerCase();
    let data = trie.find(text);          
    
    let div = document.createElement('div'); 
    div.className = "card-group";
    let divc = '';
    for (let val of data) {        
        divc = divc + `<div id="word-${val.word}" onclick="remove(event)" class="card-body btn btn-${val.color} m-2 p-2 rounded text-center shadow" style="max-width: fit-content;">${val.word}</div>\n`;
    }
    div.innerHTML = divc;
    document.getElementById('wordlist').append(div);
};