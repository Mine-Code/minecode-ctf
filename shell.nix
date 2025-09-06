{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_24
    pnpm
    websocat
    socat
  ];

  shellHook = ''
    pnpm install
  '';
}
