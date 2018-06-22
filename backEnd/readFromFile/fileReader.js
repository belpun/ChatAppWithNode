var fs = require('fs');

// this will be the real object
var realObj = require('./myData.json')

console.log(realObj.name);

fs.readFile('./myData.json','UTF-8', (err, data) => {
console.log(data);
//what we get back from here is the string representation
// so if you want to access the object than you have to parse it

console.log('reading the file as a readFile')
 const person = JSON.parse(data);
    console.log(person.name);
})



//exmple of reading directory

fs.readdir('C:/', (err, data)=> {
  console.log(data);
})



//example of writing to file

var newPerson = { name : 'new Name'};

fs.writeFile('./myData.json', JSON.stringify(newPerson));

