#include <socket_server.h>

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <inttypes.h>
#include <stdbool.h>

void f() {
  char buf[8] = {};

  int l = 0;
  printf("length: ");
  fflush(stdout);
  scanf("%d", &l);
  fflush(stdin);

  bool dbg = getenv("DEBUG");
  if (dbg) printf("Debugger is enabled.\n");

  printf("Reading the message...\n");

  char c = '\0';
  for (int i = 0; i < l; i++) {
    read(0, &c, 1);
    if (c == '\n') {
      printf("Warning: you inputted %d characters, %d characters remained\n", i,
             l - i);
      break;
    }
    buf[i] = c;
  }

  printf("Welcome %s!\n", buf);
}

SOCKET_MAIN("Canary", "./sockets/2022_2nd_3", f)