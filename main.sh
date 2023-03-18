#!/bin/bash

set -e

canary() {
  echo "[Manager] [Canary] Starting Server"
  CTF/2022/2nd/3.c.elf &
}

ctf() {
  echo "[Manager] [CTF] Starting Server"
  node main.js &
}

make

canary
sleep 1
ctf

wait


# websocat --binary ws-l:127.0.0.1:8080 cmd:CTF/2022/2nd/1.c