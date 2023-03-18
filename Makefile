.PHONY: all
all: CTF/2022/2nd/0.c.elf CTF/2022/2nd/1.c.elf CTF/2022/2nd/2.c.elf CTF/2022/2nd/3.c.elf

LIBCTF:=c_lib/libctf.a

FLAGS:=-Wall -Wextra -Werror -no-pie -O0 -I c_lib/include -g

$(LIBCTF): c_lib/src
	@make -C c_lib

CTF/2022/2nd/%.c.elf: CTF/2022/2nd/%.c $(LIBCTF)
	@printf "> \x1b[32mBuilding $@ with Stack=Exec|NonPotected no-PIE\x1b[0m\n"
	gcc $(FLAGS) -zexecstack -fno-stack-protector $^ -o $@

CTF/2022/2nd/3.c.elf: CTF/2022/2nd/3.c $(LIBCTF)
	@printf "> \x1b[32mBuilding $@ with Stack=NonExec|Protected no-PIE\x1b[0m\n"
	gcc $(FLAGS) $^ -o $@

dbg: CTF/2022/2nd/1.c.elf
	gdb CTF/2022/2nd/1.c.elf

run: CTF/2022/2nd/1.c.elf
	CTF/2022/2nd/1.c.elf

clean:
	rm CTF/2022/2nd/*.elf