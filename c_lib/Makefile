SOURCE_FILES := $(wildcard src/*.c src/*.cpp)

CFLAGS := -c -I include
CXXFLAGS := $(CFLAGS)

build/%.o: src/%.c
	gcc $(CFLAGS) -o $@ $^

build/%.o: src/%.cpp
	g++ $(CXXFLAGS) -o $@ $^

libctf.a: $(patsubst src/%,build/%.o,$(basename $(SOURCE_FILES)))
	ar rcs $@ $^