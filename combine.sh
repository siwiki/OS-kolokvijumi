#!/bin/sh
set -e
cd "${0%/*}"
node combine.js
pandoc combined.md -o combined.pdf
