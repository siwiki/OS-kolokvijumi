#!/bin/sh
set -e
cd "${0%/*}"

prnt=
year=
subject="./os1/"
while getopts ":y:p" opt 
do
    case $opt in
    y) year="$OPTARG"
        ;;
    p) prnt=1
        ;;
    *) printf -- "usage: ./combine.sh [-y YEAR] [-p] dir\ndir defaults to ./os1/\n"
        exit 1
        ;;
    esac
done
shift $(( $OPTIND - 1 )) 

[ ! -z "$1" ] && subject="$1"

if [ ! -d "$subject" ]; then
    printf -- "dir '$subject' doesn't exist\n"
    exit 1
fi

# ======================

if [ $prnt ]; then
    node combine.js "$subject" --print
elif [ ! -z "$year" ]; then
    node combine.js "$subject" "--year=$year"
else 
    node combine.js "$subject"
fi

latex_args="--enable-installer --shell-escape"
if [ $prnt ]; then
    pandoc print.md -s -t latex -o print.tex
    pdflatex $latex_args print.tex
    pdflatex $latex_args print.tex
else
    pandoc web.md -s -t latex -o web.tex
    pdflatex $latex_args web.tex 
    pdflatex $latex_args web.tex 
fi