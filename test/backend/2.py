try:
  num1 = int(input("num1: "))
  op = input("op: ")
  num2 = int(input("num2: "))
  if op == "/":
    print(num1 / num2)
# except ZeroDivisionError:
#   print("division by zero")
# except ValueError:
#   print("invalid value type")
except Exception as e:
  print(e)