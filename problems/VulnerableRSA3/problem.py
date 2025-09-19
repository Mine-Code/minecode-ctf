import ctf
from ctf.prime import gen_prime, is_prime
from ctf import flag, bytes_to_long, long_to_bytes

# Determinate p, q
p = gen_prime(bits=1024)
q = p + 1
while not is_prime(q):
    q += 1

# Calculate some parameters
n = p * q
e = 65537
phi = (p - 1) * (q - 1)
d = ctf.inv(e, phi)

# Calculate cipher
m = bytes_to_long(flag.encode())
c = pow(m, e, n)

print(f'n = {n}')
print(f'e = {e}')
print(f'c = {c}')
