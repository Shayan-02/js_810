// Add your JavaScript code here
// let a = "salam";
// console.log(`str: ${a.length}`);

// let arr = ["salam"]
// console.log(`array: ${arr.length}`);



class Bank {
  #balance
  constructor(balance){
    this.#balance = balance;
  }

  setBalance(balance) {
    if (balance <= 0) {
      throw new Error("balance must be atleast 1");
    }
    this.#balance = balance;
  }

  deposit(amount) {
    this.#balance += amount
  }

  getBalance() {
    return this.#balance;
  }
}

const b1 = new Bank()
b1.setBalance(1000)
b1.deposit(1000)
console.log(b1.getBalance());