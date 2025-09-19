import ctf
from ctf.prime import gen_prime
from ctf import flag, bytes_to_long

# Determinate p, q
p = gen_prime(bits=1024)
q = gen_prime(bits=1024)  # I was captivated by optimization.

# Calculate some parameters
n = p * q
e = 17
phi = (p - 1) * (q - 1)
d = ctf.inv(e, phi)

# Calculate cipher
m = bytes_to_long(flag.encode())
c = pow(m, e, n)

print(f'n = {n}')
print(f'e = {e}')
print(f'c = {c}')
