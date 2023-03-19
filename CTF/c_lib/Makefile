SOURCE_FILES := $(wildcard src/*.c src/*.cpp)

CFLAGS := -c -I include
CXXFLAGS := $(CFLAGS)

build/%.o: src/%.c
	@printf "> \x1b[32mBuilding $@ with Stack=NonExec|Protected \x1b[0m\n"
	gcc $(CFLAGS) -o $@ $^

build/%.o: src/%.cpp
	@printf "> \x1b[32mBuilding $@ with Stack=NonExec|Protected \x1b[0m\n"
	g++ $(CXXFLAGS) -o $@ $^

libctf.a: $(patsubst src/%,build/%.o,$(basename $(SOURCE_FILES)))
	@printf "> \x1b[32mCreating $@ file with $^ \x1b[0m\n"
	ar rcs $@ $^