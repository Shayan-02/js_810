class Person:
  def __init__(self, name):
    self.esm = name
    # self.pID = pID
    # self.sex = sex
    # self.age = age
    # self.job = job
  def eat(self):
    print(self.esm + " eating")
  def sleep(self):
    return self.esm + " is sleepping"


class Baby(Person):
  pass


p1 = Person("ali")
p1.eat()
b1 = Baby("reza")
b1.eat()