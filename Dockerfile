FROM ubuntu:24.04

ENV BUN_INSTALL="/root/.bun"
ENV CTF_RUNTIME_PATH=/tmp/ctf-runtime

RUN apt-get update && apt-get install --no-install-recommends -y \
  ca-certificates=20240203 \
  ca-certificates \
  curl \
  unzip && \
  rm -rf /var/lib/apt/lists/* && \
  curl -fsSL https://get.docker.com | sh && \
  curl -fsSL https://bun.com/install | bash -s "bun-v1.2.20"

COPY ctf-runtime /tmp/ctf-runtime

#* Add a dummy sudo command
# TODO(syoch): Remove this
RUN echo "" > /usr/bin/sudo && \
  chmod +x /usr/bin/sudo