# @openreachtech/hora-skills

Hora Kit で開発するための Claude Code スキルを配布するパッケージです。

## コンセプト

このパッケージが配布するのは **スキルのみ** です。`import` して使うライブラリはなく、同梱する唯一の実行コマンドはそのスキルを配置するためのものです。スキルとは `SKILL.md`(と任意の `references/`・`scripts/`)を収めたディレクトリで、Claude Code が読み込み `/<name>` として呼び出します。導入先のリポジトリにインストールすることで、Open Reach Tech が開発に用いている規約と手順を、そのリポジトリで作業するエージェントに届けます。

配布されるスキルは 110 件、3 つのドメインに分かれています。各名前の先頭 2 文字がドメインを表すので、フラットに並んだスキル一覧を見た人が、どれがこのパッケージ由来でどのドメインに属するかを一目で判別できます。

| プレフィックス | ドメイン | スキル数 | 内容 |
| :-- | :-- | --: | :-- |
| `hc-` | `core` | 34 | スタックを問わず、あらゆるプロジェクトに適用される規約と手順 |
| `hb-` | `backend` | 30 | renchan ベースの Node バックエンド |
| `hf-` | `frontend` | 46 | Furo/Nuxt アプリ |

[**スキルカタログ**](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.ja.md) ([English](https://github.com/openreachtech/hora-skills/blob/main/docs/skills.md)) — このパッケージに収録された全スキルの一覧と概要(1〜2 行)を、呼び出しコマンド名で並べています。

ソースは `kit/skills/<domain>/<name>/` にドメイン別で配置され、`dist/` が公開されるビルド成果物です。同じスキルフォルダからドメインの階層だけを取り除いた形で、これが Claude Code の求めるフラットな構成です。スキルフォルダ名はそのスキルの `name:` であり、インストール後のフォルダ名でもあります。一貫して同じ 1 つの文字列なので、カタログで見た名前がそのまま入力するコマンドになります。

## インストール

Node.js LTS が必要です(CI がビルド対象とするバージョン)。

```sh
npm install -D @openreachtech/hora-skills
```

このパッケージをインストールすることは、そのリポジトリにスキルを装備する意思表示なので、`postinstall` が `.claude/skills/` への配置まで行います。

npm は v12 から install script を既定で無効にし、それ以前のバージョンでも警告を出します。フックが動くのは許可した環境だけです。package.json のホワイトリストにこのパッケージを追加してください。

```json
{
  "allowScripts": {
    "@openreachtech/hora-skills": true
  }
}
```

`npm install-scripts approve @openreachtech/hora-skills` でも同じ項目が書き込まれます。判断待ちのパッケージは `npm install-scripts ls` で確認できます。

フックを許可したくない場合は、コマンドを自分で実行してください。フックと同じことを行います。

```sh
npx hora-skills install
```

## 使い方

スキルは自分のリポジトリの `.claude/skills/` に配置されます。Claude Code はそこからスキルを認識し、それぞれが自身の名前で呼び出せるようになります(`/hc-naming`・`/hb-query-resolver`・`/hf-cp-table` など)。インストールされたスキルは、そのリポジトリ自身のスキルと 1 つのフラットな一覧に並びます。`hc-`/`hb-`/`hf-` のプレフィックスはそのためにあります。

### ドメインを絞る

既定では全ドメインが入ります。Claude Code はインストール済みの全スキルの名前と説明を常時コンテキストに載せるため、バックエンドだけのリポジトリでもフロントエンドの 46 件分を毎ターン負担することになります。ドメイン単位で絞れます。

```sh
npx hora-skills install --domains core,backend
```

package.json に一度書いておけば、引数なしの `hora-skills install` がそれに従います。

```json
{
  "horaSkills": {
    "domains": ["core", "backend"]
  }
}
```

コマンドラインが package.json より優先され、どちらも無ければ全ドメインになります。

### リンクではなくディレクトリ

`.claude/` と、その中の `skills/` は、シンボリックリンクではなくリポジトリのディレクトリである必要があります。インストールは対象へ至る各段を検査し、いずれかがリンクであれば、何も書き込まず、何も削除せずに終了します。

フックは、スキルが入ったかどうかに関わらず `npm install` を成功させます。そして npm は、成功したスクリプトの出力を表示しません。スキルが見当たらないとき、その理由を告げるのは `npx hora-skills install` です。

リンクはコマンドを実行する人の指示ではなく、リポジトリの中身です。それを辿ると、スキルをどこへ書くか、そして前回のスキルをどこから消すかを、リポジトリ側が決められることになります。

いずれかをリポジトリ間で共有するディレクトリへ向けている場合は、そのディレクトリを直接名指ししてください。`npx hora-skills install --dir <解決先のディレクトリ>` で同じ状態に到達し、リンクがある以上、スキルは `.claude/skills/` から見えます。`--dir` はコマンドを実行する人が名指しするものなので、そのまま受け入れます。

### 配置を最新に保つ

配置されたスキルは、リポジトリのソースではなくこのパッケージのビルド成果物です。git 管理からは外します。

```gitignore
.claude/skills/hc-*/
.claude/skills/hb-*/
.claude/skills/hf-*/
.hora/
```

このパッケージを更新するとフックが再度走るので、スキルもそれに追随します。フックを使わない場合は、コマンドを自分で実行し直してください。

```sh
npx hora-skills install
```

`install` は何度実行しても同じ結果になります。前回インストールしたスキル(`.hora/equip-skills.json` に記録されています)と、このパッケージが配布するスキルと同名のフォルダを削除してから、今回の選択をコピーします。そのため改名されたスキルや選択から外れたスキルが残らず、`dist/skills/` を手でコピーしていたリポジトリも初回の実行で整理されます。

リポジトリが自分で作ったスキルは、その名前がこのパッケージの配布名と一致しない限り削除されません。`hc-`/`hb-`/`hf-` のプレフィックスを持っているだけで対象になることはなく(`hc-own-skill` は残ります)、配布スキルと完全に同じ名前を付けた場合に限り、その名前はこのパッケージのものとして扱われます。

### コマンド

| コマンド | 動作 |
| :-- | :-- |
| `hora-skills install` | 選択したスキルを配置し、前回配置したものを置き換える |
| `hora-skills list` | 現在の選択で配置されるスキルを表示する(配置はしない) |
| `hora-skills uninstall` | このパッケージが配置したスキルとマニフェストを削除する |
| `hora-skills help` | 使い方を表示する |

`--dir <path>` で `.claude/skills` 以外のディレクトリに配置できます。

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
