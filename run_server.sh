#!/bin/bash

set -e

printf "\e[1;32mUntaring problems...\e[0m\n"

for t in $(find problems -name "*tar*"); do
  p=$PWD
  cd $(dirname $t)
  printf "\e[33m>> $(dirname $t)\e[0m\n"
  folder_name=$(basename $t .tar.gz)
  if [ -d $folder_name ]; then
    printf "\e[33m< Go to $p\e[0m\n"
    cd $p
    continue
  fi

  mkdir -p $folder_name
  tar -xf $(basename $t) -C $folder_name

  printf "\e[33m<< $p\e[0m\n"
  cd $p
done

export PROBLEMS=$(find . -name "metadata.json" | xargs dirname | tr '\n' ',' | sed 's/,$//')

printf "\e[1;32mMaking Docker Image\e[0m\n"
make -C docker_image

printf "\e[1;32mMSetup metadata.json owner\e[0m\n"
find . -name "metadata.json" | xargs sudo chown $USER

printf "\e[1;32mStarting main program\e[0m\n"
bun index.js

printf "\e[1;32mMRestore metadata.json owner\e[0m\n"
find . -name "metadata.json" | xargs sudo chown $USER