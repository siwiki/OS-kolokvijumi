#!/bin/sh
set -e
cd "${0%/*}"
if [ -z "$1" ]
then
    node combine.js
else
    node combine.js "--year=$1"
fi
pandoc combined.md -o combined.pdf
