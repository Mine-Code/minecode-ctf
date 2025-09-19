FROM minecode-ctf-runner

WORKDIR /mnt
COPY problem.py /mnt/problem.py
COPY flag.txt /mnt/flag.txt
RUN python3 problem.py > output.txt

ENTRYPOINT ["cat", "/mnt/output.txt"]