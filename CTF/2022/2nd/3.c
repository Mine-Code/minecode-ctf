#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <kbhit.h>
#include <inttypes.h>

int f(int sock)
{ 
  char buf[8] = {};

  int l = 0;
  printf("length: "); fflush(stdout);
  scanf("%d", &l);
  fflush(stdin);

  bool dbg = getenv("DEBUG");
  
  if (dbg) printf("Debugger is enabled.\n");

  printf("Reading the message...\n");
  
  char c = '\0';
  for (int i = 0; i < l; i++) {
    read(sock, &c, 1);
    if (c == '\n') {
      printf("Warning: you inputed %d characters, %d characters remained\n", i, l - i);
      break;
    }
    buf[i] = c;
  }

  printf("Welcome %s!\n", buf);
  return 0;
}

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/wait.h>
#include <errno.h>
#include <string.h>
#include <sys/un.h>

void handle_errno(const char *name, int ret) {
  printf("[Utilities] The syscall(%s) has successed.\n", name);
  if (ret != 0) {
    printf("[Utilities] The syscall(%s) has failed.\n", name);
    printf("[Utilities]   errno = %d (%s)\n", errno, strerror(errno));
    exit(1);
  }
}
int main()
{
  int sock0 = socket(AF_LOCAL, SOCK_STREAM, 0);

  struct sockaddr_un addr;
  addr.sun_family = AF_LOCAL;
  strcpy(addr.sun_path, "./sockets/2022_2nd_3");

  remove("./sockets/2022_2nd_3");
  handle_errno("bind", bind(sock0, (struct sockaddr *)&addr, sizeof(addr)));

  printf("[CTF Problem Server] Canary: Waiting for connection...\n");
  
  handle_errno("listen", listen(sock0, 30));
  
  for (;;) {
    struct sockaddr_in client;
    socklen_t len = sizeof(client);
    int sock = accept(sock0, (struct sockaddr *)&client, &len);
    
    printf("[CTF Problem Server] Canary: Got new client %d\n", sock);
    if (fork() == 0) {
      close(0);dup(sock);
      close(1);dup(sock);
      close(2);dup(sock);
      
      f(sock);
      printf("Ended your session.\n");
      
      shutdown(sock, SHUT_RDWR);
      close(sock);
      exit(0);
      return 0;
    }
  }

  close(sock0);

  return 0;
}
