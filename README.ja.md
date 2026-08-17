# @openreachtech/hora-skills

Hora Kit で開発するための Claude Code スキルを配布するパッケージです。

## コンセプト

このパッケージが配布するのは **スキルのみ** で、呼び出すための実行コードは含みません。スキルとは `SKILL.md`(と任意の `references/`・`scripts/`)を収めたディレクトリで、Claude Code が読み込み `/<name>` として呼び出します。導入先のリポジトリにインストールすることで、Open Reach Tech が開発に用いている規約と手順を、そのリポジトリで作業するエージェントに届けます。

配布されるスキルは 107 件、3 つのドメインに分かれています。各名前の先頭 2 文字がドメインを表すので、フラットに並んだスキル一覧を見た人が、どれがこのパッケージ由来でどのドメインに属するかを一目で判別できます。

| プレフィックス | ドメイン | スキル数 | 内容 |
| :-- | :-- | --: | :-- |
| `hc-` | `core` | 33 | スタックを問わず、あらゆるプロジェクトに適用される規約と手順 |
| `hb-` | `backend` | 29 | renchan ベースの Node バックエンド |
| `hf-` | `frontend` | 45 | Furo/Nuxt アプリ |

[**スキルカタログ**](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.ja.md) ([English](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.md)) — このパッケージに収録された全スキルの一覧と概要(1〜2 行)を、呼び出しコマンド名で並べています。

ソースは `kit/skills/<domain>/<name>/` にドメイン別で配置され、`dist/` が公開されるビルド成果物です。同じスキルフォルダからドメインの階層だけを取り除いた形で、これが Claude Code の求めるフラットな構成です。スキルフォルダ名はそのスキルの `name:` であり、インストール後のフォルダ名でもあります。一貫して同じ 1 つの文字列なので、カタログで見た名前がそのまま入力するコマンドになります。

## インストール

Node.js LTS が必要です(CI がビルド対象とするバージョン)。

```sh
npm install @openreachtech/hora-skills
```

このパッケージに JavaScript のエントリポイントはありません。`dist/` 配下の静的コンテンツを配布するもので、`import` するのではなく、自分のリポジトリへコピーして使います(下記の使い方を参照)。

## 使い方

スキルを自分のリポジトリの `.claude/skills/` へコピーします。`dist/skills/` はすでにフラットな構成なので、中身をそのまま移すだけで、剥がすべきディレクトリはありません。

```sh
cp -r node_modules/@openreachtech/hora-skills/dist/skills/* .claude/skills/
```

Claude Code はそこからスキルを認識し、それぞれが自身の名前で呼び出せるようになります(`/hc-naming`・`/hb-query-resolver`・`/hf-cp-table` など)。インストールされたスキルは、そのリポジトリ自身のスキルと 1 つのフラットな一覧に並びます。`hc-`/`hb-`/`hf-` のプレフィックスはそのためにあります。

## コントリビューション

バグ報告・機能要望・コード貢献を歓迎します。

GitHub Issues からお気軽にご連絡ください。

```sh
git clone https://github.com/openreachtech/hora-skills.git
cd hora-skills
npm install
npm run lint
npm test
```

## ライセンス

本プロジェクトは Apache License 2.0 で公開されています。

詳細は [LICENSE ファイル](./LICENSE) を参照してください。

## 開発者

[Open Reach Tech Inc.](https://openreach.tech)

## 著作権

© 2026 Open Reach Tech Inc.
