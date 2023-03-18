#include <stdlib.h>
#include <stdio.h>

typedef unsigned char u8;

typedef struct _Status {
    char name[8];
    u8 is_admin;
} Status;

int main() {
  Status status = {"", 0};
  
  printf("What's your name? (8): ");
  gets(status.name);

  if (!strcmp(status.name, "admin")) {
    if (status.is_admin) {
      printf("Welcome Admin!\n");
      printf("flag: %s\n", getenv("FLAG_0")); 
    } else {
      printf("You are not admin...\n");
    }
  } else {
    printf("Welcome %s\n", status.name);
  }
  return 0;
}