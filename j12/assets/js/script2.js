class Car {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
  present() {
    return "I have a " + this.brand + " year is " + this.year;
  }
}

class Model extends Car {
  constructor(brand, year, model) {
    super(brand, year);
    this.model = model;
  }
  show() {
    return this.present() + ", it is a " + this.model;
  }
}

let myCar = new Model("Ford", 2010, "Mustang");
console.log(myCar.show());
