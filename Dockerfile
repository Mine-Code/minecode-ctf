FROM ubuntu:24.04

ENV CTF_RUNTIME_PATH=/tmp/ctf-runtime

RUN apt-get update && apt-get install --no-install-recommends -y \
  ca-certificates=20240203 \
  ca-certificates \
  curl \
  unzip \
  make \
  && \
  rm -rf /var/lib/apt/lists/* && \
  curl -fsSL https://get.docker.com | sh && \
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g pnpm

COPY ctf-runtime /tmp/ctf-runtime

#* Add a dummy sudo command
# TODO(syoch): Remove this
RUN echo "" > /usr/bin/sudo && \
  chmod +x /usr/bin/sudo
