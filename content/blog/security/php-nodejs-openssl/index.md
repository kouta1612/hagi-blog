---
title: "PHP ⇔ NodeJS での暗号化・復号"
description: "異なる言語間で認証情報を OpenSSL aes-256-cbc を利用して暗号化したものを複合できるかどうかをPHP,NodeJSを例に検証しました。"
image: "./php-node-openssl.png"
alt: "PHP⇔NodeJS OpenSSL"
date: "2022-03-12"
tags: ["PHP", "NodeJS", "Security"]
---

## 概要

仕事でデータベースに保存している個人情報を暗号化・復号するにあたって

フレームワークや開発言語が変わった場合も想定して PHP に依存した機能を使わない方法で実施する必要がありました。

そこで、PHP と NodeJS 間で OpenSSL aes-256-cbc を用いた暗号化・復号が可能であるかを検証しました。

## 暗号化・復号の過程で主に使うもの

具体的に使うのは、PHP と NodeJS が提供する標準的なオブジェクトや関数です。

PHP は、暗号化アルゴリズムを扱うために[openssl_encrypt](https://www.php.net/manual/ja/function.openssl-encrypt.php)と[openssl_decrypt](https://www.php.net/manual/ja/function.openssl-decrypt.php)を使用します。

NodeJS は、バイナリデータを扱うために[buffer](https://nodejs.org/api/buffer.html)を使用し、暗号化アルゴリズムを扱うために[crypto](https://nodejs.org/api/crypto.html)を使用します。

## PHP で暗号化し NodeJS で復号

まずは PHP で認証情報を暗号化します。

openssl_encrypt の第 1 引数が今回の暗号化対象文字列で、第 3 引数の passphrase と第 5 引数の iv がキーに該当します。

passphrase は 32bit である必要があり、iv は 16bit である必要があります。

```
>>> openssl_encrypt(
    'xxxxxx@gmail.com',
    'aes-256-cbc',
    'cJe6y8sbPskC6NNA5ABD20nTtVyQ5etH',
    0,
    's968wEYFzxJzenjw'
);
=> "M1CctVjYqzA1v5hpk7t1hnR5oc5DDpl9j7xdQeK5xnY="

```

次に NodeJS で認証情報を復号します。

```
> const key = new Buffer.from('cJe6y8sbPskC6NNA5ABD20nTtVyQ5etH');
undefined
> const iv = new Buffer.from('s968wEYFzxJzenjw');
undefined
> const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
undefined
> let decipheredData = decipher.update('M1CctVjYqzA1v5hpk7t1hnR5oc5DDpl9j7xdQeK5xnY=', 'base64', 'utf8');
undefined
> decipheredData += decipher.final("utf8");
'xxxxxx@gmail.com'

```

以上の結果から、PHP で暗号化した認証情報を NodeJS で復号できることを確認できました。

## NodeJS で暗号化し PHP で復号

反対に NodeJS で認証情報を暗号化します。

```
> const key = new Buffer.from('cJe6y8sbPskC6NNA5ABD20nTtVyQ5etH');
undefined
> const iv = new Buffer.from('s968wEYFzxJzenjw');
undefined
> const encipher = crypto.createCipheriv("aes-256-cbc", key, iv);
undefined
> let encrypted = encipher.update('xxxxxx@gmail.com', 'utf8', 'base64');
undefined
> encrypted += encipher.final("base64");
'M1CctVjYqzA1v5hpk7t1hnR5oc5DDpl9j7xdQeK5xnY='

```

次に PHP で認証情報を復号します。

```
>>> openssl_decrypt(
    'M1CctVjYqzA1v5hpk7t1hnR5oc5DDpl9j7xdQeK5xnY=',
    'aes-256-cbc', 'cJe6y8sbPskC6NNA5ABD20nTtVyQ5etH',
    0,
    's968wEYFzxJzenjw'
);
=> "xxxxxx@gmail.com"

```

以上の結果から、NodeJS で暗号化した認証情報を PHP で復号できることを確認できました。

## まとめ

いかがでしたでしょうか。

試してないですが恐らく今回扱った言語以外でも同じように対応できると思うので、言語を切り替えたりしたとしてもスムーズに移行できるのではないかと思います。
