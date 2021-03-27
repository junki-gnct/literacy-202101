# GNCT Literacy (IoT) 2021/03
~~2021年1月~~2021年3月(1月から変更)に行われる岐阜高専ものづくりリテラシー教育活動に使用するプログラム群

## 環境構築方法
0. Docker環境の構築
0. docker-compose.sample.ymlをdocker-compose.ymlという名前でコピーする
0. docker-compose.ymlファイルの MYSQL_PASSWORD を変更す
    - MYSQL_USER を変更した場合は/mysql/initdb.d/1_createDatabase.sqlを編集する。
0. サーバー起動コマンドを実行する

## コマンド
```bash
# サーバーの起動
$ docker-compose up -d --build

# サーバーの停止
$ docker-compose stop
```

## アクセス方法
サーバー起動後、https://localhost/ にアクセスする。

## フォルダ構成
```
L /
  L www/      -- nginx公開ディレクトリ
  L nginx/    -- nginx設定用ディレクトリ
    L ssl/          -- HTTPS通信用証明書
  L api/      -- APIサーバー用スクリプト
    L src/          -- APIサーバースクリプト  
```

## メモ
https://localhost/ にアクセスしたときに証明書エラーが出るのが気になる場合はca.crtを信頼できるルート証明書として指定する。

必要な場合はssl/server.*を自分で再生成する。

## 著作権表記
Copyright (c) 2021 Junki Tomatsu, Yusei Nishikura, and Hayato Nomiya All rights reserved.