#!/bin/sh
set -e
cd "${0%/*}"

# Colors.
white="\033[0;37m"      # White - Regular
bold="\033[1;37m"       # White - Bold
cyan="\033[1;36m"       # Cyan - Bold
green="\033[1;32m"      # Green - Bold
red="\033[1;31m"        # Red - Bold
color_reset="\033[0m"   # Reset Colors

prnt=
year=
generate=
subject="os1"
while getopts ":y:g:p" opt
do
    case $opt in
    y) year="$OPTARG"
        ;;
    p) prnt=1
        ;;
    g) generate="$OPTARG"
        ;;
    *) printf -- "usage: ./combine.sh [-y YEAR] [-g GENERATE] [-p] dir\ndir defaults to ./os1/\n"
        exit 1
        ;;
    esac
done
shift $(( $OPTIND - 1 ))

[ ! -z "$1" ] && subject="$1"

echo -e "${white}Compiling ${bold}${subject} colloquia${linux_version} ${white}into PDF...${color_reset}"

if [ ! -d "$subject" ]; then
    printf -- "dir '$subject' doesn't exist\n"
    exit 1
fi

# Clear converted SVGs
echo -e "-> ${cyan}Cleaning cached files...${color_reset}"
rm -rf svg-inkscape

# Running combine.js
echo -e "-> ${cyan}Combining into Markdown...${color_reset}"

combine_args="$subject"

if [ $prnt ]; then
    combine_args="$combine_args --print"
fi

if [ ! -z "$year" ]; then
    combine_args="$combine_args --year=$year"
fi

if [ ! -z "$generate" ]; then
    combine_args="$combine_args --generate=$generate"
fi

node combine.js $combine_args

# Compiling Markdown into LaTeX
echo -e "-> ${cyan}Compiling LaTeX...${color_reset}"

latex_args="--halt-on-error --shell-escape"
for file in $subject-*.md
do
    tex_file=`echo $file | sed -e 's/[.]md$/.tex/'`
    log_file=`echo $file | sed -e 's/[.]md$/.log/'`
    echo -e "-> ${cyan}Converting $file...${color_reset}"
    pandoc "$file" -s -t latex -o "$tex_file"
    i=0
    while [[ $i -lt 5 ]]
    do
        echo -e "-> ${cyan}Compiling $tex_file, pass $i...${color_reset}"
        pdflatex $latex_args "$tex_file"
        if grep -q "may have changed[.] Rerun" "$log_file"
        then
            # Try again.
            ((i++)) && true
            continue
        fi
        break
    done
    if [ "$i" -eq 5 ]
    then
        echo -e "-> ${red}ERROR: ${white}Compiling ${bold}$tex_file${white} failed to stabilize!${color_reset}"
        exit 1
    fi
    ((i++)) && true
    echo -e "-> ${cyan}Compilation of ${green}$tex_file${cyan} succeeded after ${green}$i${cyan} pass(es).${color_reset}"
done

# Cleaning up generated files
echo -e "-> ${cyan}Cleaning up...${color_reset}"
rm *.aux *.idx *.ilg *.ind *.log *.tex *.toc os*.md
rm -rf _minted*

echo -e "\n${green}Complete! ${white}Please report any issues to ${bold}https://github.com/siwiki/OS-kolokvijumi/issues${color_reset}"
