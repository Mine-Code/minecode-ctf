#pragma once
#ifndef SOCKET_SERVER_H
#define SOCKET_SERVER_H

void handle_errno(const char* name, int ret);
int server_start(const char* problem_name, const char* socket_path,
                 void (*f)());

#define SOCKET_MAIN(pname, socket_path, f) \
  int main() { return server_start((pname), (socket_path), (f)); }

#endif