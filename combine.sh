#!/bin/sh
set -e
cd "${0%/*}"
if [ -z "$1" ]
then
    node combine.js
else
    if [ "$1" == "print" ]
    then
        node combine.js --print
    else
        node combine.js "--year=$1"
    fi
fi
if [ "$1" == "print" ]
then
    pandoc combined-print.md -s -t latex -o combined-print.tex
    xelatex combined-print.md 
else
    pandoc combined-web.md -s -t latex -o combined-web.tex
    xelatex combined-web.md 
fi
