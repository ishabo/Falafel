import Blockchain from ".";

const bc = new Blockchain()

for (let i=0; i<100; i++) {
  console.log(bc.addBlock(`foo ${i}`).toString())
}
