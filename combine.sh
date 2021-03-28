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
    pandoc combined-print.md -o combined-print.pdf
else
    pandoc combined-web.md -o combined-web.pdf
fi
