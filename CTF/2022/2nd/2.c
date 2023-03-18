#include <stdlib.h>
#include <stdio.h>
#include <string.h>

typedef unsigned char u8;

int main() {
  char flag[20] = {};

  char name[50] = {};

  printf("What's your name?: \n");

  fgets(name, 100, stdin);

  char *flag_p = getenv("FLAG_2");
  memcpy(flag, flag_p, strlen(flag_p));

  printf("Hello! %s\n", name);

  return 0;
}