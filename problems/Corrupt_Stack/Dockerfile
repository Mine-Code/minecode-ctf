FROM minecode-ctf-runner

WORKDIR /mnt
COPY main.c /mnt/main.c
RUN gcc -no-pie -fno-stack-protector main.c -o main

ENV FLAG=mineCTF{7h3_St4Ck_0v3r_F10w}
ENTRYPOINT ["/mnt/main"]