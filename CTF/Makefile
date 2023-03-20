.PHONY: all
all: ctflib 2022/2nd/0.c.elf 2022/2nd/1.c.elf 2022/2nd/2.c.elf 2022/2nd/3.c.elf

.PHONY: ctflib
ctflib:
	@make -C ../../../docker_image

LIBCTF:=c_lib/libctf.a

FLAGS:=-Wall -Wextra -Werror -no-pie -O0 -I c_lib/include -g

2022/2nd/%.c.elf: 2022/2nd/%.c $(LIBCTF)
	@printf "> \x1b[32mBuilding $@ with Stack=Exec|NonPotected no-PIE\x1b[0m\n"
	gcc $(FLAGS) -zexecstack -fno-stack-protector $^ -o $@

2022/2nd/3.c.elf: 2022/2nd/3.c $(LIBCTF)
	@printf "> \x1b[32mBuilding $@ with Stack=NonExec|Protected no-PIE\x1b[0m\n"
	gcc $(FLAGS) $^ -o $@

dbg: 2022/2nd/1.c.elf
	gdb 2022/2nd/1.c.elf

run: 2022/2nd/1.c.elf
	2022/2nd/1.c.elf

clean:
	rm 2022/2nd/*.elf