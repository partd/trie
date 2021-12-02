/*
TODO
1. Clean delete intead of soft delete.
2. Sorting as a trie property. Currently sorting is complete list sort.
*/

class Trie {
    constructor() {
        this.children = {};
        this.end = false;
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
    }

    find(prefix) {
        // find prefix end node        
        let pnode = this;
        for (let letter of prefix) {
            if (letter in pnode.children) pnode = pnode.children[letter];
            else return [];
        }        
        
        // find all words
        function dfs(node, word) {
            let words = [];
            if (node.end) words.push(word);            
            for (let key in node.children) {
                words = words.concat(dfs(node.children[key], word + key));
            };
            return words;
        }    
        
        return dfs(pnode, prefix).sort();
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
    
    let word = element.value;
    element.value = '';
    
    trie.insert(word);
    search(event);    
};


function remove(event) {
    event.preventDefault();        
    
    trie.delete(event, document.getElementById(event.target.id).textContent);    
    search(event);    
}


function search(event) {
    event.preventDefault();
    document.getElementById('wordlist').innerHTML = '';

    let text = document.getElementById(searchId).value;
    let data = trie.find(text);          
    
    let ul = document.createElement('ul');
    let li = '';
    for (let word of data) {        
        li = li + `<li class="word" id="word-${word}" onclick="remove(event)">${word}</li>\n`;
    }
    ul.innerHTML = li;
    document.getElementById('wordlist').append(ul);
};