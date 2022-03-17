#!/bin/sh
set -e
cd "${0%/*}"

rm -rf os*.pdf
./combine.sh os1
./combine.sh -p os1
./combine.sh os2
./combine.sh -p os2
