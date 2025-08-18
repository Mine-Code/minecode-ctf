FROM ubuntu:24.04

RUN apt-get update && apt-get install --no-install-recommends -y \
  ca-certificates=20240203 \
  curl=8.5.0-2ubuntu10.6 && \
  rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install --no-install-recommends -y \
  unzip && \
  rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://get.docker.com -o get-docker.sh && \
  sh get-docker.sh

RUN curl -fsSL https://bun.com/install | bash -s "bun-v1.2.20"
ENV BUN_INSTALL="/root/.bun"

COPY ctf-runtime /tmp/ctf-runtime
ENV CTF_RUNTIME_PATH=/tmp/ctf-runtime

RUN echo "" > /usr/bin/sudo
RUN chmod +x /usr/bin/sudo