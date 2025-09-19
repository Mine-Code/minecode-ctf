FROM minecode-ctf-runner

WORKDIR /mnt
COPY main.c /mnt/main.c
RUN gcc -no-pie -fno-stack-protector main.c -o main

ENV FLAG=mineCTF{Nu1L_7eRm1n4t10n_bR3aK1nG}
ENTRYPOINT ["/mnt/main"]