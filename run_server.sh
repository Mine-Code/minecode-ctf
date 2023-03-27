#!/bin/bash

set -e

PROBLEM_CONTAINERS=""

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

init_problems() {
  printf "\e[1;32mInitializing all problems\e[0m\n"
  for problem in $(echo $PROBLEMS | tr ',' '\n'); do
    p=$PWD
    printf "\e[32m  Initializing at $problem\e[0m\n"

    cd $problem

    CID=$(docker run -div $PWD:/mnt minecode-ctf-runner .mc_ctf/init.sh &)
    printf "\e[2;32m    => $CID\e[0m\n"

    cd $p
  done
  printf "\e[1;33mWaiting initializing process\e[0m\n"
  wait
}

start_problem_daemons() {
  printf "\e[1;32mStarting daemon processes\e[0m\n"
  for problem in $(echo $PROBLEMS | tr ',' '\n'); do
    p=$PWD
    printf "\e[32m  Starting at $problem\e[0m\n"

    cd $problem

    CID=$(docker run -ditv $PWD:/mnt minecode-ctf-runner .mc_ctf/daemon.sh)
    PROBLEM_CONTAINERS="$PROBLEM_CONTAINERS $CID"
    printf "\e[2;32m    => $CID\e[0m\n"

    cd $p
  done
}

untar_problems

export PROBLEMS=$(find problems -name "metadata.json" | xargs dirname | tr '\n' ',' | sed 's/,$//')

init_problems

start_problem_daemons

printf "\e[1;32mSetup metadata.json owner\e[0m\n"
find . -name "metadata.json" | xargs sudo chown $USER

printf "\e[1;32mStarting main program\e[0m\n"
set +e; bun server/main.ts; set -e

printf "\e[1;32mRestore metadata.json owner\e[0m\n"
find . -name "metadata.json" | xargs sudo chown $USER

printf "\e[1;32mStopping Daemon tasks\e[0m\n"
for cid in $PROBLEM_CONTAINERS; do
  printf "\e[32m  Stopping $cid\e[0m\n"
  docker stop $cid &
done

wait