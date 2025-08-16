#!/bin/bash
set -e

untar_problems() {
  printf "\e[1;32mUntaring problems...\e[0m\n"

  for t in $(find problems -name "*tar*"); do
    p=$PWD
    cd $(dirname $t)
    printf "\e[32m>> $(dirname $t)\e[0m\n"
    folder_name=$(basename $t .tar.gz)
    if [ -d $folder_name ]; then
      printf "\e[33m<< $p (skipped)\e[0m\n"
      cd $p
      continue
    fi

    mkdir -p $folder_name
    tar -xf $(basename $t) -C $folder_name

    printf "\e[33m<< $p\e[0m\n"
    cd $p
  done
}

untar_problems


printf "\e[1;32mSetup metadata.json owner\e[0m\n"
find . -name "metadata.json" | xargs sudo chown $USER

printf "\e[1;32mStarting main program\e[0m\n"
export PROBLEMS=$(find problems -name "metadata.json" | xargs dirname | tr '\n' ',' | sed 's/,$//')
bun server/main.ts