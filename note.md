# 問題の提出方法について

問題の提出は以下のファイルを持つ tar.gz ファイルを Discord @syoch#5433 に投げてください

- metadata.json
- その他問題、デーモンなどで使用するファイル

また、 tar.gz ファイルは Docker イメージの /mnt に展開されます。

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

## Tasks の書き方

### 全タスク共通事項

- カレントディレクトリは /mnt です。必要に応じて cd コマンドなどで移動してください

### `runtime` について

`runtime` に書かれているプログラムはユーザーが接続した際に実行されるプログラムです。
また、ユーザーが入力した文字列は随時プログラムの標準入力に書き込まれます。

### C 言語のプログラムを使用する場合の例

- `init`: `gcc main.c -o main`
- `runtime`: `./main`
- `daemon`: `:`

## カテゴリー番号

カテゴリー番号は以下のテーブルに従います

| id |Name|Description|
|:--:|:---|:----------|
|0|Binary Exploitation|プログラムの脆弱性を使ってフラグを得る問題|
|1|Forensics|データを解析しフラグを得る問題|
|2|Cryptography|暗号を解きフラグを得る問題|
|3|Reverse Engineering|プログラムをリバースエンジニアリングし、フラグを得る問題|
