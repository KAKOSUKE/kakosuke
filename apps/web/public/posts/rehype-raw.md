## react-markdown のテーブル内で改行する： rehype-raw 活用法

`react-markdown` はMarkdownをReactコンポーネントに変換するための便利なライブラリですが、デフォルト設定のままではテーブルセル内での改行ができません。Markdown内に `<br>` タグを記述しても、そのまま文字列として表示されてしまいます。

この記事では、`rehype-raw` プラグインを使用して、テーブル内での改行を実現する方法を解説します。

### 問題点：デフォルトではHTMLタグが解釈されない

`react-markdown` は、セキュリティ上の理由から、デフォルトではMarkdownに記述されたHTMLタグを無効化（サニタイズ）します。

例えば、以下のようなMarkdownを記述しても、`<br>` タグは改行として解釈されません。

```markdown
| ヘッダーA | ヘッダーB |
|---|---|
| 内容1 <br /> 内容2 | 内容3 |
```

### 解決策：rehype-raw を使用する

`rehype-raw` は、`react-markdown` のプラグインの一つで、Markdown内の生のHTMLを解釈できるようにする機能を提供します。これを導入することで、`<br>` タグを正しく改行として扱うことが可能になります。

### 実装手順

#### 1\. パッケージのインストール

まず、`react-markdown` と `rehype-raw` をプロジェクトにインストールします。

```bash
npm install react-markdown rehype-raw
```

または

```bash
yarn add react-markdown rehype-raw
```

#### 2\. コンポーネントの実装

次に、`react-markdown` を使用しているコンポーネントで `rehype-raw` をインポートし、`rehypePlugins` プロパティに設定します。

**MarkdownComponent.js**

```jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MarkdownComponent = () => {
  const markdownContent = `
### 改行ありテーブル

| 商品名 | 詳細 |
|---|---|
| 商品A | ・軽量 <br /> ・防水 |
| 商品B | ・高機能 <br /> ・多色展開 <br /> ・限定モデル |
`;

  return (
    <div>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
```

上記の例では、`rehypePlugins` プロパティに `[rehypeRaw]` を渡しています。これにより、`markdownContent` 内の `<br>` タグがHTML要素として解釈され、テーブルセル内で正しく改行が表示されるようになります。

### まとめ

`react-markdown` でテーブル内の改行を実現するには、`rehype-raw` プラグインの利用が有効です。`rehypePlugins` プロパティに `rehypeRaw` を追加するだけで、`<br>` タグをはじめとする生のHTMLタグをMarkdown内で手軽に扱えるようになります。

なお、外部から取得した信頼できないMarkdownコンテンツを扱う際は、HTMLの許可がクロスサイトスクリプティング（XSS）のリスクに繋がる可能性がある点に留意してください。

### 関連リンク

  * **GitHub Repository:** [https://github.com/remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)