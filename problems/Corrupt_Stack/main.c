#include <stdio.h>
#include <stdlib.h>

__attribute__((constructor))
static void init(void) {
  setbuf(stdin, NULL);
  setbuf(stdout, NULL);
}

typedef unsigned char u8;

void flag() {
  printf("Flag: %s\n", getenv("FLAG"));
  exit(0);
}

int main() {
  char name[8] = {};

  printf("What's your name? (256):\n");

  fgets(name, 2560, stdin);

  return 0;
}
