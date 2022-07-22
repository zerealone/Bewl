import bewl #imports the bewl.py (which actually the main file of this)

while True: #this will run forever
	text = input('Bewl v2 > ')
	result, error = bewl.run('<stdin>', text)

	if error: print(error.as_string()) #sends errors if there are
	else: print(result) #if there are no errors, return result of the commands
