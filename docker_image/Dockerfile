FROM ubuntu:18.04

WORKDIR /mnt

RUN apt-get update; \
  apt-get install --no-install-recommends -y g++=4:7.4.0-1ubuntu2.3; \
  apt-get install --no-install-recommends -y jq=1.5+dfsg-2; \
  rm -rf /var/lib/apt/lists/*

RUN useradd -m ctf

COPY ctflib/libctf.a /usr/local/lib/
COPY ctflib/include /usr/local/include/

COPY runtime.sh /bin/runtime.sh
RUN chmod +x /bin/runtime.sh

# docker run -it -v $PWD/work:/mnt --rm minecode-ctf-runner:latest sh -c
ENV CHALLENGE yes
ENTRYPOINT [ "/bin/runtime.sh" ]