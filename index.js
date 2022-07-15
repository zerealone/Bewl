const fs = require('fs')
const path = require('path')
class Bewl{
  constructor(codes){
    this.codes = codes
  }
  tokenize() {
    const length = this.codes.length
    let pos = 0
    let tokens = []
    const BUILT_IN_KEYWORDS = ["log"]
    const varChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
    while (pos < length) {
      let currentChar = this.codes[pos]
      if (currentChar === " " || currentChar === "\n") {
        pos++
        continue
      } else if (currentChar === '"') {
        let res = ""
        pos++
        while (this.codes[pos] !== '"' && this.codes[pos] !== '\n' && pos < length) {
          res += this.codes[pos]
          pos++
        }
        if (this.codes[pos] !== '"') {
          return {
            error: `Unterminated string`
          }
        }
        pos++
        tokens.push({
          type: "string",
          value: res
        })
      } else if (varChars.includes(currentChar)) {
        let res = currentChar
        pos++
        while (varChars.includes(this.codes[pos]) && pos < length) {
          res += this.codes[pos]
          pos++
        }
        if (!BUILT_IN_KEYWORDS.includes(res)) {
          return {
            error: `Unexpected token ${res}`
          }
        }
        tokens.push({
          type: "keyword",
          value: res
        })
      } else { 
        return {
          error: `Unexpected character ${this.codes[pos]}`
        }
      }
    }
    return {
      error: false,
      tokens
    }
  }
  run() {
    const {
      tokens,
      error
    } = this.tokenize()
    if (error) {
      console.log(error)
      return
    }
    console.log(tokens)
  }
  parse(tokens){
    const len = tokens.length
    let pos = 0
    while(pos < len) {
      const token = tokens[pos]
      if(token.type === "keyword" && token.value === "log") {
        if(!tokens[pos + 1]) {
          return console.log("Unexpected end of line, expected string")
        }
        let isString = tokens[pos + 1].type === "string"
        if(!isString) {
          return console.log(`Unexpected token ${tokens[pos + 1].type}, expected string`)
        }
        console.log('\x1b[0m',tokens[pos + 1].value)
        pos += 2
      } else{
        return console.log(`Unexpected token ${token.type}`)
      }
    }
  }
  run(){
    const {tokens, error} = this.tokenize()
    if(error){
      console.log(error)
      return
    }
    this.parse(tokens)
  }
}

const codes = fs.readFileSync(path.join(__dirname, 'index.bewl'), 'utf8').toString().replace(/\r/g )
const bewl = new Bewl(codes)
bewl.run()
