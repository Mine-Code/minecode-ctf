# 2023 MineCode CTF の問題の提出について

- Rev.3 (2023/03/24)

## 問題の提出方法について

問題の提出は out.tar.gz ファイルを .tar.gz で終わる任意のファイル名を持つものにリネームして \
Discord @syoch#5433 に投げてください

## ProblemSDK について

MineCodeCTF では問題制作側への支援として、問題の tar.gz ファイルを容易に作成できる SDK を用意しています。

### ProblemSDK のインストール

```bash
curl -sL https://raw.githubusercontent.com/Mine-Code/CTF-ProblemSDK/master/quick_install.sh | bash -s -- -
```

## ProblemSDK を用いたプロジェクトのディレクトリ構造

### src ディレクトリ

このディレクトリに書き込まれたファイルはそのまま .tar.gz ファイルに含まれます。
なお、metadata.json というファイルが自動作成されますが、基本的には編集しないでください。
代わりに、config.json を編集してください。

### .mc_ctf/config.json

```json
{
  "name": "Basic Exploitation", // 問題名
  "author": "syoch", // 問題作成者
  "description": "Basic Exploitation", // 問題についての説明
  "category": 0, // 回答するカテゴリーの番号
  "flag_hash": "xxx", // flag の SHA256 ハッシュ
  "hints": [], // ヒント文字列の配列
  "files": {
    "vuln": "main" // 公開するファイルの連想配列
  }
}
```

#### カテゴリー番号

カテゴリー番号は以下のテーブルに従う問題の種類を表す番号です。

| id |Name|Description|
|:--:|:---|:----------|
|0|Binary Exploitation|プログラムの脆弱性を使ってフラグを得る問題|
|1|Forensics|データを解析しフラグを得る問題|
|2|Cryptography|暗号を解きフラグを得る問題|
|3|Reverse Engineering|プログラムをリバースエンジニアリングし、フラグを得る問題|
|4|General Skills|それぞれのジャンルが混合/それ以外の知識を用いてフラグを得る問題|

### .mc_ctf/.env について

このファイルは各シェルスクリプトを実行する際に最初に読み込まれるファイルです。
また、読み込んだあとは、 root アカウントでない限り読み込むことが出来ないので、 .env を読み込むような設計は出来ません。
代わりに、環境変数を参照してください。

### .mc_ctf/flag.txt　について

### .mc_ctf/*.sh について

これらのファイルは CTF サーバーから呼び出される様々なファイルです。
また、これらのファイルの初期状態でのカレントディレクトリは `/mnt` です。
必要に応じて cd コマンドなどで移動してください

#### init.sh

これは問題の初期化を行うときに実行されるファイルで
`mc_ctf init` 直後では `gcc` を用いて実行ファイルを用意するコマンドが書かれています。

#### daemon.sh

これは問題のデーモンサービスを定義しているファイルです。
Linux Domain Socket を用いた問題などではここで Socket を Listen する実行ファイルを起動したりします。

#### runtime.sh

問題に対して入力を試みたするときにこれが実行されます。
また、ユーザーが入力した文字列は随時プログラムの標準入力に書き込まれます。
C/C++ を用いた問題では `init.sh` で作成した実行ファイルをここで呼んだりすることが多いです。

## 実行環境について

- 実行時には /mnt/metadata.json が root:root の 700 で権限系が初期化されるため、実行時にデータを読み取るためには SUID が設定されている必要があります。

### ctflib について

この Docker イメージには ctflib というちょっとしたライブラリが導入されています

ctflib には次のヘッダーファイルと静的リンクファイルがあります。

### `kbhit.h`

- `void KB_open(void)`
  - `kbhit` 関数を使用するために呼び出す必要があります。
  - ターミナルの情報を一部書き換えるため、`KB_close` も呼ぶ必要があります。
- `void KB_close(void)`
  - KB_open で書き換わった情報などをもとに戻します。
- `bool kbhit(void)`
  - キーボードが打たれて `stdin` のバッファになにかデータがあるかを監視します。
  - `true` であればデータがあり、 `false` であればデータが無いことを表します
- `char linux_getch(void)`
  - `kbhit` と組み合わせて使われ、`kbhit` で読み込んでしまったデータを取得できます。
  - なお、２度 `kbhit` を経由して `stdin` からデータを読み込んでしまった場合、最後のデータのみが取得できます。

### `socket_server.h`

- `SOCKET_MAIN(pname, socket_path, f)`
  - Unix domain Socket を用いた fork 型のサーバーを立ち上げる main 関数に展開されます。
  - `pname` はログなどに使用されるため、 metadata.json のデータと合わせてください。
  - `socket_path` は基本的にどこでもいいです。
    - daemon.sock などがおすすめです。
  - `f` は void(*)() 型のクライアントコールバックです

### `flag.h`

- `const char* get_flag_from_env()`
  - フラグを FLAG 環境変数からとりだす関数です。

### Docker イメージに初期状態でインストールされてるパッケージの一覧

- g++=4:7.4.0
- python3=3.6.5-3
- nodejs=8.10.0