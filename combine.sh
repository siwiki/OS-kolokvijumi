#!/bin/sh
set -e
cd "${0%/*}"
node combine.js
pandoc combined.md --toc --pdf-engine=xelatex -o combined.pdf
