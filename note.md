# 2023 MineCode CTF の問題の提出について

- Rev.2 (2023/03/20)

## 問題の提出方法について

問題の提出は以下のファイルを持つ tar.gz ファイルを Discord @syoch#5433 に投げてください

- metadata.json
- その他問題、デーモンなどで使用するファイル

また、 tar.gz ファイルは Docker イメージの /mnt に展開されます。

## ProblemSDK について

MinecodeCTF では問題制作側への支援として、問題の tar.gz ファイルを容易に作成できる SDK を用意しています。

### インストール

```bash

```


## .tar.gz ファイルの作り方

metadata.json のあるディレクトリに移動して次のコマンドを実行してください。

```bash
tar cf - . | gzip > challenge.tar.gz
```


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

## metadata.json の構造

```json
{
  // 以下固定フィールド
  "type": "challenge",
  "version": 0,
  // 固定フィールド終わり
  "name": "Basic Exploitation", // 問題名
  "author": "syoch", // 問題作成者
  "description": "Basic Exploitation", // 問題についての説明
  "category": 0, // 回答するカテゴリーの番号
  "flag_hash": "xxx", // flag の SHA256 ハッシュ
  "hints": [], // ヒント文字列の配列
  "tasks": {
    "init": ":", // チャレンジの初期化コマンド: gcc など
    "runtime": "./main", // チャンレジへの対話型コマンド
    "daemon": ":" // チャンレジ中にバックグラウンドで動作しているコマンド: socket サーバーなど
  },
  "files": {
    "vuln": "main" // 公開するファイルの連想配列
  }
}
```

### Tasks の書き方

#### 全タスク共通事項

- カレントディレクトリは /mnt です。必要に応じて cd コマンドなどで移動してください

#### `runtime` について

`runtime` に書かれているプログラムはユーザーが接続した際に実行されるプログラムです。
また、ユーザーが入力した文字列は随時プログラムの標準入力に書き込まれます。

#### C 言語のプログラムを使用する場合の例

- `init`: `gcc main.c -o main`
- `runtime`: `./main`
- `daemon`: `:`

### カテゴリー番号

カテゴリー番号は以下のテーブルに従います

| id |Name|Description|
|:--:|:---|:----------|
|0|Binary Exploitation|プログラムの脆弱性を使ってフラグを得る問題|
|1|Forensics|データを解析しフラグを得る問題|
|2|Cryptography|暗号を解きフラグを得る問題|
|3|Reverse Engineering|プログラムをリバースエンジニアリングし、フラグを得る問題|
|4|General Skills|それぞれのジャンルが混合/それ以外の知識を用いてフラグを得る問題|
