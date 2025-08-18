FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Tokyo

RUN apt update && apt install -y  \
  openssh-server  \
  curl && \
  rm -rf /var/lib/apt/lists/*

RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
COPY setup_authorized_keys.sh /tmp/setup_authorized_keys.sh
COPY entry.sh /tmp/entry.sh

ENTRYPOINT ["/tmp/entry.sh"]