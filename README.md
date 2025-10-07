# ittokunvim website

`ittokunvim-xyz`はittokunvimが公開しているWebサイトです

## はじめに

サイトを立ち上げる前に以下のアプリケーションが必要です。

- [Docker](https://www.docker.com/)

次は`Docker`ビルド時に`SSH`キーが必要になります。
以下のコマンドと記事を参考にしながら`SSH`キーを作成していきます。

```sh
# SSHキーを作成
$ ssh-keygen -t ed25519
# SSHキーを追加(mac専用)
$ ssh-add --apple-use-keychain ~/.ssh/github
# 接続を確認
$ ssh -T github

# 参考URL
# https://zenn.dev/schnell/articles/0e1c2e9db5c08d
```

次は環境変数の設定です。`.env.local`ファイルを作成して値を書いていきます。
見本として`.env.example`ファイルを作成しているので、これを参考に変数を設定します。

以下のコマンドを実行するとスムーズに設定することが可能です。

```bash
# .env.exampleファイルをコピーし、.env.localファイルを作成
cp .env.example .env.local
# プライベートIPアドレスを確認
make echo_ip
```

これで準備は完了です！

以下のコマンドを実行してサイトを立ち上げてみましょう！

```bash
# ビルド
make build
# 立ち上げ
make up
```

以下のURLにアクセスすることができれば成功です！

http://localhost:3000

