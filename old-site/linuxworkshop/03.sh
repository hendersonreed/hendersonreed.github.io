#!/bin/bash 
if [[ $# -eq 0 ]] ; then
	echo "No arguments supplied. Please supply the name of the file you would like to create."
	exit 1
fi
touch $1.cpp $1.h # $1 is the first argument in the program call.
echo -e "//Henderson Hummel\n// $1.cpp\nusing namespace std;\n\nint main() {\n\n}" > $1.cpp
echo -e "//Henderson Hummel\n// $1.h\n#include <iostream>\n#include <cstring>" > $1.h
vim -p $1.cpp $1.h
