{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    bun
    websocat
    socat
  ];

  shellHook = ''
    bun install
  '';
}
