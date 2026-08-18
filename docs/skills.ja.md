# Skills

このリポジトリに収録されている全 108 件のスキルの一覧と、それぞれの概要(1〜2 行)です。

各スキルは `kit/skills/<domain>/<name>/` に置かれ、ドメインディレクトリの直下 1 段に並びます。このフォルダ名がそのスキルの `name:` であり、インストール先のフォルダ名でもあります。したがって下表の**スキル**だけを見れば足ります。`/name` として呼び出す名前であり、インストール後に `.claude/skills/` に現れる名前であり、ソースの置き場所でもあります。先頭 2 文字はドメインを表します。配置と命名の規約は [flatten ビルドの規約](https://github.com/openreachtech/hora-skills/blob/main/.claude/skills/flatten/SKILL.md) を参照してください。各スキルの完全な内容は、それぞれの `SKILL.md` にあります。

## `core` — `hc-*`

34 件。スタックを問わず、あらゆるプロジェクトに適用される規約と手順です。

| スキル (= コマンド) | 概要 |
| :-- | :-- |
| `hc-accessors` | アクセサ(getter/setter)の規約。不変性のため setter は禁止、`#get:Ctor` は `this.constructor` 専用、依存参照は getter に切り出します。 |
| `hc-async` | 非同期コードの規約。Promise を書くときは可能な限り `async`/`await` を使います。 |
| `hc-charters-coding` | ORT のコーディング憲章。読みやすく統一されたコードを書く、修正を避ける、コードにすべてを説明させる。 |
| `hc-classes-constructor` | クラスコンストラクタの規約。コンストラクタの引数にデフォルト値を持たせません。 |
| `hc-classes-inflators` | inflator(バインドメソッド)の規約。引数で渡されたクラスをバインドし、`BoundCtorRegistry` でメモ化した派生サブクラスを返すパターンと、その命名・引数。 |
| `hc-classes-notations` | クラス本体でメンバーを書く順序。8 ブロックの配置順と、getter 内・メソッド内での並び順を定義します。 |
| `hc-classes-principles` | クラス設計の原則。プロパティを持たないクラスを作らないという大原則と、それを支える仕組み(深い不変性、コンストラクタのみ、参照＝契約)。 |
| `hc-classes-prohibits` | クラス定義における禁止事項。static のみのクラスと、状態(プロパティ)を持たないクラスを禁止する方針とその理由。 |
| `hc-code-review` | 変更をコードレベルで読み取り専用にレビューし、仕様適合性・正当性・規約準拠についての所見レポートを出します。修正は一切しません。 |
| `hc-coding-styles` | コーディングスタイル。式・メソッド/プロパティチェーン・関数呼び出しの引数・テンプレートリテラル・正規表現フラグの chop down(改行)位置。 |
| `hc-comments` | コメント記述の規約。実コード内のコメントは、理由がない限り英語で書きます。 |
| `hc-constants` | 定数の規約。命名(大文字 SNAKE_CASE、enum 的オブジェクトは単数形)、chop down、オブジェクト型定数のファイル構成と配置。 |
| `hc-contracts` | 関数・メソッドの引数と戻り値の型契約、および契約型の定義方法。 |
| `hc-dependency-defect` | 自分が所有していないコード(パッケージなど)の不具合への対処。壊れているメンバーだけを override するサブクラスを作り、自分の名前で呼び出し、いつ削除できるかをコメントに残します。 |
| `hc-documentation` | ドキュメント記述の規約。ドキュメント内でクラスメンバーを参照する際の `#instanceMember` / `.staticMember` 記法などを定義します。 |
| `hc-errors` | エラーハンドリングの規約。値を生成するメソッドは失敗時に `null` を返す、抽象メンバーの throw メッセージ形式など。 |
| `hc-functions` | 関数の規約。引数はメソッドの引数に準じ、名前付き引数を原則とします。 |
| `hc-git-commit` | コミットの規約。1 コミットに含める粒度と、メッセージ形式(命令形 / Conventional Commits のいずれかをプロジェクト単位で選択)。 |
| `hc-implementation-progress` | 進行中の実装状況を、要件 ID に紐づけた進捗ドキュメントで可視化します。ステータスは記録された根拠に基づいてのみ前進させます。 |
| `hc-jest` | JavaScript クラスの Jest ユニットテストを書きます。 |
| `hc-jsdoc` | バックエンドとフロントエンドで共通の JSDoc 記述規約。型アノテーション、`@returns`、`@typedef`、型のみインポートを定義し、Vue/Nuxt 固有の規約は参照ファイルにまとめています。 |
| `hc-license` | プロジェクトの LICENSE ファイルを作成・更新します。 |
| `hc-methods` | メソッド定義の規約。名前付き引数、private メソッドへのプロパティの渡し方、ファクトリメソッドなど。 |
| `hc-modules-exports` | 関数を名前付き export するだけのファイルは定義せず、責務ごとにクラスを定義します。 |
| `hc-modules-imports` | import はファイル冒頭にまとめ、アプリケーション開発から遠いものから近いものへ並べます。 |
| `hc-naming` | 命名規約。クラス・メソッド・プロパティ・アクセサの命名、日時サフィックス(`At`/`On`、範囲は `From`/`To`)、略語基準、米国綴り、禁止語、非 ASCII 禁止。 |
| `hc-properties` | プロパティの規約。コンストラクタ内で `this` に設定、不変(再代入禁止・`Map` 禁止)、JavaScript ネイティブ private は使いません。 |
| `hc-readme` | プロジェクトの README を作成・更新します。 |
| `hc-requirement-definition` | 曖昧な依頼を、依頼者との対話を通じて要件定義書にします。要件・観測可能な受入基準・スコープ外リスト・未決事項をまとめます。 |
| `hc-scope` | クラスメンバー間のスコープ参照。static 同士は `this` で参照し、インスタンスから static を参照する場合は `#get:Ctor` を経由します。 |
| `hc-skill-updating` | スキル(`SKILL.md`)の新規作成・更新の規約。命名、配置ルール、ディレクトリ構成、記述時の作法を定義します。 |
| `hc-statements` | 文と制御フローの規約。本番コードでのリテラル `undefined` 禁止、逐次処理より高階関数、三項演算子・`if` の方針。 |
| `hc-test-execution` | プロジェクトのテストを実行し、テストを弱めずに green にします。スキップ・削除・条件の緩和・待ち回避はしません。 |
| `hc-workflows` | 開発ワークフローの手続き規約。実装の進め方と、コミット前・完了前に必ず行う手順を定義します。 |

## `backend` — `hb-*`

29 件。いずれも renchan ベースの Node バックエンド向けです。

| スキル (= コマンド) | 概要 |
| :-- | :-- |
| `hb-agent-loop` | `@openreachtech/mentsu-agent-loop` の 3 パッケージで LLM エージェントループを構築します。core(反復エンジン)、BullMQ ジョブ実行、GraphQL の起動 mutation と進捗 subscription。 |
| `hb-ai-agent-structure` | `mentsu-agent-loop-core` 上にアプリ側 AI エージェントを構成します。`app/agents/<name>/` に `ProceduralAgentLoop` サブクラスとステップごとの `BaseAgentAction` サブクラスを置きます。 |
| `hb-ai-prompt-document-store` | エージェントの設定・指示文・ドキュメント・ツールスキーマをコードに埋め込まず DB に保持し、リクエスト時にプロンプトへ組み立て、バックアップテーブルでバージョン管理します。 |
| `hb-backend-testing` | テストファイルの配置(DB 書き込みなしは `tests/__tests__`、ありは `tests/_orders`)、DB 書き込みテストの実行順の保証、実行方法、テストとダブルの純粋性ルール。 |
| `hb-build-e2e-test-environment` | `e2e/docker/` 配下の手動操作用ローカル E2E 環境の構築・実行・デバッグ。コンテナ構成、専用シードセット、`up`/`start`/`seed`/`clean`/`down` スクリプト。 |
| `hb-constant-definition` | アプリ定数は必ず 2 ファイルで定義します。`constants/` の CommonJS マスター(単一の情報源)と、それを再 export する `app/constants/` の ESM ブリッジ。 |
| `hb-database-design` | マイグレーションやモデルを書く前に決めるスキーマの論理設計。正規化の判断、ステータス/カテゴリの表現、カラム型、時刻の保持、読み取りのスケール、履歴とバージョン管理。 |
| `hb-execution-placement-pattern` | 処理(特に書き込み)をどこに実装するかの判断。同期的な GraphQL/REST 操作か、API ハンドラ・post-worker・スケジュールから起動するバックグラウンドワーカーか。 |
| `hb-external-api-client` | `@openreachtech/mentsu-rocket-client` で外部 HTTP/REST API クライアントを実装します。`app/<serviceName>Client/` 配下の Launcher / Payload / Capsule の 3 クラス構成。 |
| `hb-graphql-schema` | renchan サーバの GraphQL SDL(`.graphql`)を書きます。オーディエンス別スキーマ、ドメイン別の番号付きファイル、カスタムスカラー、命名・null 許容・enum・ページネーションの規約。 |
| `hb-graphql-server-engine` | エンドポイントごとの `*GraphqlServerEngine` を実装・起動します。URL、スキーマパス、リゾルバディレクトリ、Share/Context の DI、認証フィルタ、ミドルウェア、スカラー、エラーコード。 |
| `hb-light-rag` | ベクタ DB なしで AI エージェント向けの軽量 RAG を追加します。ローカル埋め込みによる vector-first / LLM フォールバックのランキングと、MySQL の n-gram 全文検索インデックス。 |
| `hb-multi-llm-provider` | Claude / OpenAI / Gemini を 1 つの抽象の下で扱います。抽象モデルプロセッサ、ベンダーごとの基底、モデルごとの具象クラス、モデル名で選択するローダー。 |
| `hb-mutation-resolver` | `BaseMutationResolver` を継承した GraphQL Mutation リゾルバを実装します。状態を変更する操作と、それが動く単一トランザクション。 |
| `hb-post-worker` | post-worker を実装します。リゾルバが解決してレスポンス送信後に発火し、API の本処理に含めない副作用(通知メール、監査ログ、キャッシュ無効化)を実行するフックです。 |
| `hb-query-resolver` | `BaseQueryResolver` を継承した GraphQL Query リゾルバを書きます。ページネーション、関連の include、ドメインエラーの throw、actual と stub のペア。 |
| `hb-renchan-job-bullmq` | `@openreachtech/renchan-job-bullmq` でバックグラウンドジョブを実装・配線します。Manifest / Worker / Dispatcher の 3 点セット、繰り返しジョブ、enqueue、進捗配信、並列数とリトライ。 |
| `hb-resolver-share` | Share クラスを実装します。サーバ起動時に一度作られ `context.share` として全リゾルバに渡されるプロセス単位のシングルトン置き場で、Share と Context の使い分けも扱います。 |
| `hb-resolver-validator` | リゾルバの入力検証クラス(`*InputValidator`)を実装します。`BaseInputValidator` を継承し、値の検査は `mentsu-value-inspector` に委譲します。 |
| `hb-restfulapi-architecture` | renchan バックエンドの REST 層。`server/restfulapi/` 配下のレンダラーアーキテクチャ、ルートとバージョン、`render()`、レスポンス/エラーハッシュ、認証フィルタ、フラッシャー。 |
| `hb-security-audit` | Node プロジェクト全体を読み取り専用でセキュリティ監査し、所見リストを出します。インジェクション、認証漏れ、ポート/データストア露出、シークレット、依存、CORS、レート制限、PII、アップロード。 |
| `hb-sequelize-migration` | renchan/Sequelize のマイグレーションを書きます。`createTable`、`addColumn`/`removeColumn`、`addIndex`、インデックス命名、外部キーカラムを持たせるかの判断。 |
| `hb-sequelize-model` | renchan/Sequelize のモデル定義を書きます。属性、`createOptions`、アソシエーション、スコープ、フック、`MixinModel` の配線。 |
| `hb-sequelize-seeder` | renchan/Sequelize のシーダーを書きます。master / dev-master / development の 3 ディレクトリ分割、ファイル雛形、ファイル名の採番、ファイルごとの ID ブロック採番。 |
| `hb-sequelize-subquery` | `this.addSubquery` で名前付きサブクエリを定義し、`Model.subquery(name, params)` で使います。関連テーブルの条件による絞り込みは JOIN ではなくサブクエリで行います。 |
| `hb-strategy-pattern` | 型文字列で分岐する else-if / switch を、基底プロセッサ・バリアントごとのサブクラス・ディレクトリから自動発見して選ぶ一括ローダーの 3 点構成に置き換えます。 |
| `hb-stub-api` | DB アクセスもビジネスロジックも持たず、スキーマどおりの固定データを返す stub リゾルバを実装します。実装前の API 契約に対してフロントエンドが開発できます。 |
| `hb-subscription-resolver` | GraphQL subscription リゾルバを実装します。操作の宣言、購読者ごとのチャンネルのスコープ、購読可否のゲート、イベントを push する publish 側の配線。 |
| `hb-type-interface` | `.d.ts` で型インターフェースを定義します。`types/models/` のモデルインターフェース(global `model`)と、`types/resolvers/<category>/` のリゾルバ Input/Result 型。 |

## `frontend` — `hf-*`

45 件。Furo/Nuxt アプリ向けのスキルと、スタックに依存しない CSS・UI/UX 規約です。`hf-cp-*` は `@openreachtech/furo-vue` を利用するリポジトリ向けのコンポーネント選定スキル群で、UI 要件の口語表現から適切な `Furo*` コンポーネントへ振り分けます。

| スキル (= コマンド) | 概要 |
| :-- | :-- |
| `hf-acceptance-review` | 実装後にアプリ全体を受入観点でレビューします。バックエンドの全操作が UI から到達可能か、エンティティごとの CRUD が揃っているか、操作要素が実際に機能するか、失敗と待ちを正直に伝えているか。 |
| `hf-animation` | UI アニメーションの規約。そもそも動かすべきか、`--transition-timing-*` トークンからのイージング選択、入場・ポップオーバー・ツールチップ・ブラーの手法。 |
| `hf-cp-button` | クリックで動作するアクショントリガー(送信・プライマリ・アイコン・ローディングボタン)。`FuroButton` へ振り分けます。 |
| `hf-cp-checkbox-toggle` | 真偽値のコントロール(チェックボックス、オン/オフスイッチ、ツールバーのトグルボタン)。`FuroCheckbox`・`FuroToggle` へ振り分けます。 |
| `hf-cp-collapsible` | 表示/非表示を切り替える領域、または開閉できるセクションの集合(アコーディオン、FAQ リスト)。`FuroCollapsible`・`FuroAccordion` へ振り分けます。 |
| `hf-cp-control-block` | フォームフィールドをラベル・ヒント・必須マーク・エラーメッセージで包みます。`FuroControlBlock` へ振り分けます。 |
| `hf-cp-date-time` | 日付・時刻の選択コントロール。`FuroDatePicker`・`FuroTimeField`・`FuroDateTimePicker` へ振り分けます。 |
| `hf-cp-dialog` | モーダル、確認/破壊的操作のプロンプト、サイドパネル。`FuroDialog`・`FuroAlertDialog`・`FuroDrawer` へ振り分けます。 |
| `hf-cp-dropdown-menu` | ボタンやアイコンから開くアクションメニュー(ケバブ、コンテキスト、三点メニュー)。`FuroDropdownMenu` へ振り分けます。 |
| `hf-cp-editable-field` | クリックしてその場で編集する値の表示。`FuroEditableField` へ振り分けます。 |
| `hf-cp-editor` | リッチテキストの編集領域(WYSIWYG、書式付きコメント、メンション付きチャット入力)。`FuroEditor` へ振り分けます。 |
| `hf-cp-empty-state` | レコードがない領域のプレースホルダー、または読み込みに失敗して再試行できる領域の表示。`FuroEmptyState`・`FuroErrorState` へ振り分けます。 |
| `hf-cp-popover` | トリガーに紐づくフローティングパネル、またはホバー/フォーカス時のヒント。`FuroPopover`・`FuroTooltip` へ振り分けます。 |
| `hf-cp-select` | リストから 1 つ以上の値を選ぶ(検索付きドロップダウン、タイプアヘッド、複数選択)。`FuroSelect`・`FuroAutocompleteField` へ振り分けます。 |
| `hf-cp-splitter` | サイズ変更できる左右のペイン、装飾付きスクロール領域、区切り線。`FuroSplitter`・`FuroScrollArea`・`FuroSeparator` へ振り分けます。 |
| `hf-cp-stepper` | 複数ステップのフロー表示(ウィザードの進捗、多段フォーム、購入ステップ)。`FuroStepper` へ振り分けます。 |
| `hf-cp-table` | 行選択・ソートを伴う表形式データと、そのページ送り。`FuroTable`・`FuroPagination` へ振り分けます。 |
| `hf-cp-tabs` | タブで切り替える領域とセグメンテッドコントロール的なナビゲーション。`FuroTabs` へ振り分けます。 |
| `hf-cp-text-field` | 1 行のテキスト入力(メール、パスワード、数値、ファイルアップロード)。`FuroTextField`・`FuroEmailField`・`FuroPasswordField`・`FuroNumberField`・`FuroFileField` へ振り分けます。 |
| `hf-cp-textarea` | 複数行のテキスト入力(コメント欄、説明文フィールド)。`FuroTextarea` へ振り分けます。 |
| `hf-cp-toast` | 一時的な通知(成功/失敗のスナックバー、操作後のメッセージ)。`FuroToast`・`FuroToaster` へ振り分けます。 |
| `hf-cp-toggle-group` | セグメンテッドなトグルコントロール、またはボタン・トグル・区切りをまとめてキーボード操作できるコンテナ。`FuroToggleGroup`・`FuroToolBar` へ振り分けます。 |
| `hf-css` | Furo/Nuxt アプリの CSS アーキテクチャとスタイリング規約。ユニットセレクタの命名、デザイントークン、グローバルスタイルシートのレイヤリング。 |
| `hf-css-coding-styles` | CSS のコーディングスタイル(整形と記法)の規約。 |
| `hf-css-layers` | CSS カスケードレイヤー(`@layer`)の規約。レイヤーの順序と各レイヤーの役割。 |
| `hf-css-line-height` | 既定値は `--value-golden-ratio`(黄金比 1.618)で、単位なしで保持します。個別に別の値が必要な場合のみ上書きします。 |
| `hf-css-prohibits` | 禁止する CSS の記法(アンチパターン)を集めた規約。 |
| `hf-css-props-naming` | カスタムプロパティの命名規約。値の種類を示すトッププレフィックスのルールと、palette / color の 2 層ルール。 |
| `hf-css-props-prohibits` | カスタムプロパティ定義の禁止事項。相対サイズは huge / large / medium / small / tiny の 5 段階に限定し、過度に細かい段階や `x-` 系のラベルを禁止します。 |
| `hf-css-units` | CSS の単位に関する規約の入口。基準単位や値の粒度などのルールをトピック別にまとめます。 |
| `hf-css-z-index` | `z-index` の規約。3 つのレイヤー基準値と `calc()` 記法。 |
| `hf-e2e-test-specification` | E2E テスト仕様書の作成と保守。API の面から導いた「プロダクトが満たすべきこと」をフローごとに列挙した永続的なリストで、操作手順(how)は書きません。 |
| `hf-error-handling` | バックエンドのドット区切りエラーコードを `app/constants-error.js` と i18n ロケールパス経由でユーザー向け文言に対応づけ、`errorMessageHashReactive` と `error.vue` で表示します。 |
| `hf-furo-context-patterns` | Furo の Context クラスの使い方。`BaseAppContext` のジェネリクス、`create()`/`setupComponent()` のライフサイクル、setup からの DI、watcher、`*PageContext`/`*Context` の分類。 |
| `hf-furo-env` | Furo の環境変数(`.furo-env` ファイル)を設定します。変数の追加・変更、エンドポイントやキーの配線。 |
| `hf-graphql` | Furo アプリの GraphQL。生成されたスキーマ型(`types/graphql-schema.d.ts`)と、`app/graphql/client` 配下の操作クライアント。 |
| `hf-layout-margin` | Flex / Grid の余白はコンテナの責務で、レイアウトアイテムは margin を持ちません。均等な余白は `gap`、例外的な余白は親から子セレクタで指定します。 |
| `hf-modules` | 再利用する汎用ロジックはユーティリティ関数や composable ではなくクラスに置きます。Furo は OOP 構成を採るためです。 |
| `hf-nuxt` | Nuxt/Furo フロントエンドを OpenReach 流に構築します。pages、components、composables、`useState` ストア、AppShare サービス(`$furo`)、middleware、plugins、layouts、型宣言。 |
| `hf-prohibits` | Vue コンポーネントの禁止事項。`.vue` の `<template>` 内に JavaScript のロジックを書かず、Context のメンバーへ移します。 |
| `hf-restful` | `app/restfulapi/renchan/` の REST クライアント。GraphQL と同じ Launcher/Payload/Capsule の 3 点構成、`BASE_URL`、`/v1` プレフィックス、アクセストークンヘッダー。 |
| `hf-selector-props-sort` | CSS プロパティの並び順(Outer-to-Inner Order)。プロパティが何に作用するかで分類し、外側から内側へ並べ、グループ内はアルファベット順にします。 |
| `hf-uiux-audit` | 既存のフロントエンド成果物(コード、スクリーンショット、モックアップ、公開 URL、Figma)を監査し、UX/UI・インタラクション・アクセシビリティ・法務/同意の問題を重大度順のレポートにします。新規実装はしません。 |
| `hf-uiux-context` | `hf-uiux-forge`(生成)と `hf-uiux-audit`(レビュー)が共通で読む `uiux-context.md` を作成・記入します。アプリ種別、ユーザー、スコープ、技術スタック、トークンの場所、アクセシビリティ目標、ブランド。 |
| `hf-uiux-forge` | 本番品質のフロントエンド UI(既定は React/Tailwind)を、最初から正しい状態で生成します。WCAG AA、デザイントークン、インタラクション状態、レスポンシブレイアウト、同意と法務要件。 |
