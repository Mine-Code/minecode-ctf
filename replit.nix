{ pkgs }: {
    deps = [
        pkgs.strace
        pkgs.openssh_with_kerberos
        pkgs.prelink
        pkgs.gdb-multitarget
        pkgs.nodejs-16_x
        pkgs.websocat
        pkgs.tinycc
        pkgs.socat
        pkgs.nmap_graphical
        pkgs.busybox
        pkgs.htop
        pkgs.bashInteractive
    ];
}