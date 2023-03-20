#include <socket_server.h>

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
int server_start(const char *problem, const char *socket_path, void (*f)()) {
  int sock0 = socket(AF_LOCAL, SOCK_STREAM, 0);

  struct sockaddr_un addr;
  addr.sun_family = AF_LOCAL;
  strcpy(addr.sun_path, socket_path);

  remove(socket_path);
  handle_errno("bind", bind(sock0, (struct sockaddr *)&addr, sizeof(addr)));

  printf("[%s]: Waiting for connection...\n", problem);

  handle_errno("listen", listen(sock0, 30));

  for (;;) {
    struct sockaddr_in client;
    socklen_t len = sizeof(client);
    int sock = accept(sock0, (struct sockaddr *)&client, &len);

    printf("[%s]: Got new client %d\n", problem, sock);
    if (fork() == 0) {
      close(0);
      dup(sock);
      close(1);
      dup(sock);
      close(2);
      dup(sock);

      f();

      shutdown(sock, SHUT_RDWR);
      close(sock);
      exit(0);
      return 0;
    }
  }

  close(sock0);

  return 0;
}
