{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    bun
    websocat
    socat
  ];
}
