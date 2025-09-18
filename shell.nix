{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    pnpm
    websocat
    socat
  ];

  shellHook = ''
    pnpm install
  '';
}
