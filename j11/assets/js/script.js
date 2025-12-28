// Add your JavaScript code here
class Person {
  // property
  job = "student";
  #balance = 1000
  // method
  constructor(name, age, balance){
    this.esm = name,
    this.sen = age
    // this.balance = balance
  };
  info() {
    return `hi my name is ${this.esm} and my age is ${this.sen}`
  }
  sleep() {
    return `${this.esm} is sleepping...`
  }
  eat() {
    return `${this.esm} is eatting...`
  }
  showBalance() {
    return `your balance is ${this.#balance}$`
  }
}

// object
const p1 = new Person("reza", 20, 1000)
console.log(p1.info());
console.log(p1.sleep());
console.log(p1.eat());
console.log(p1.esm);
console.log(p1.job);
console.log(p1.balance);
p1.balance = 10000
console.log(p1.showBalance());



console.log("-----------------------");

// object
const p2 = new Person("mohammad", 25)
console.log(p2.info());
console.log(p2.sen);



let arr = ["ali", "reza"]
// let arr = 12
console.log(arr.includes("mohammad"));
