#!/usr/bin/env sh

cd `dirname $0`

set -e

# build minecode-ctf-runner
if [ -z "$CTF_RUNTIME_PATH" ]; then
  [ -d ./ctf-runtime ] && CTF_RUNTIME_PATH=./ctf-runtime
fi

if [ -n "$CTF_RUNTIME_PATH" ] && [ -d "$CTF_RUNTIME_PATH" ] && [ -f "$CTF_RUNTIME_PATH/Makefile" ]; then
  printf "\e[1;32mBuilding minecode-ctf-runner via Makefile (%s)\e[0m\n" "$CTF_RUNTIME_PATH"
  make -C "$CTF_RUNTIME_PATH"
else
  printf "\e[33mSkipping runner build (path or Makefile missing): %s\e[0m\n" "${CTF_RUNTIME_PATH:-unset}"
fi

# check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed or not in PATH"
  exit 1
fi

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
export PROBLEM_V2_PATH=$PWD/problems
pnpm start
