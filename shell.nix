{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    websocat
    socat
    pnpm
    lsof
  ];

  shellHook = ''
    pnpm install
  '';
}
