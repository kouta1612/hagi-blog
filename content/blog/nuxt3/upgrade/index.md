---
title: "Nuxt3へアップデートする際に導入した新機能"
description: "Nuxt2からNuxt3へアップデートする際に新しく導入した新機能について書いています"
image: "./nuxt3.png"
alt: "migration from nuxt2 to nuxt3"
date: "2022-11-13"
tags: ["Nuxt", "Vue"]
---

## はじめに

私が働いている会社での既存プロジェクトではNuxt2で開発していましたが、新規プロジェクトでの開発時期にNuxt3のRC版がリリースされてしばらく立っておりリリース時には安定しているだろうということとパフォーマンスが高くなることを期待し、まずは新規プロジェクトだけでNuxt3を導入しようとなりました。
既存プロジェクトでNuxt2を使っていてNuxt3にアップデートしたい場合は、先にNuxt Bridgeを導入した方が大規模な書き換えや変更のリスクを負うことなくNuxt3と同じ機能が使えるようになるそうです。
（ただ、useAsyncDataとuseFetch composablesが使用できないなど、いくつかの制限があります）
参考: [https://v3.nuxtjs.org/bridge/overview](https://v3.nuxtjs.org/bridge/overview)

## Nuxt3へアップデートする際に新しく導入した機能

### Vuex → Pinia

Piniaは現在公式が推奨しているストアライブラリで、コンポーネントやページ間で状態を共有することができます。
Vuexと比較して、PiniaはシンプルなAPIとComposition-APIスタイルのAPIを提供し、TypeScriptで使用したときにしっかりとした型推論をサポートしています。
下記に記載した公式サンプルコードのように、storeでデータやメソッドを定義して、コンポーネント側で定義したストアを利用します。

```Nuxt3
// ストアを定義するところ
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

```

```Nuxt3
// ストアを利用するコンポーネント
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // or using an action instead
    counter.increment()
  },
}

```

参考: [https://pinia.vuejs.org/](https://pinia.vuejs.org/)

### axios → ohmyfetch

HTTPリクエストを利用するのにaxiosからohmyfetchに更新しました。
[公式ドキュメント](https://v3.nuxtjs.org/api/utils/dollarfetch/#fetch)によるとNuxt3からHTTPリクエストをする際には[ohmyfetch](https://github.com/unjs/ohmyfetch)を利用するのが推奨されています。
SSRとCSRでリクエストホストを自動的に変えたり、レスポンス情報にアクセスしたい場合は、[オプションを付与して生成されたインスタンスをグローバルに呼べるようにしたり](https://github.com/unjs/ohmyfetch#%EF%B8%8F-create-fetch-with-default-options)、[$fetch.rawで生成されたインスタンスを返す](https://github.com/unjs/ohmyfetch#-access-to-raw-response)ようライブラリ化したものを使うようにしたら便利かと思います。
新規プロジェクトでは下記のようなコードを実装し、各コンポーネントで利用しています。（最初はレスポンス情報にset-cookieを付与していましたが、Piniaを導入してからエラーになりset-cookieを付与しないようにしたら正常に機能したので、現状は$fetch.rawの箇所に特別な処理は書いてないです。）

```Nuxt3
// @/composables/useApi.ts
import { UseFetchOptions } from '#app';
import { NitroFetchRequest } from 'nitropack';
import { KeyOfRes } from 'nuxt/dist/app/composables/asyncData';

// fetchオプションをグローバルに付与
export const useApi = async <T>(
  request: NitroFetchRequest,
  opts?:
    | UseFetchOptions<
        T extends void ? unknown : T,
        (res: T extends void ? unknown : T) => T extends void ? unknown : T,
        KeyOfRes<
          (res: T extends void ? unknown : T) => T extends void ? unknown : T
        >
      >
    | undefined
) => {
  const config = useRuntimeConfig();

  const useFetch = $fetch.create({
    baseURL: process.server ? config.public.baseURL : config.browserBaseURL,
    // eslint-disable-next-line require-await
    async onRequest({ options }) {
      options.headers = useRequestHeaders(['cookie']) as Record<string, string>;
    },
    // eslint-disable-next-line require-await
    async onRequestError({ request, error }) {
      console.log('[fetch request error]', request, error);
    },
    // eslint-disable-next-line require-await
    async onResponseError({ request, response }) {
      console.log(
        '[fetch response error]',
        request,
        response.status,
        response.body
      );
    },
    ...opts,
  });

  const res = await useFetch.raw(request);
  return res._data;
};

```

```Nuxt3
// 上記ライブラリを利用する
<script setup lang="ts">
const data = await useApi('/api/json');
</script>

<template>
  <div>
    <p>{{ data }}</p>
  </div>
</template>

```

### Webpack4→Vite, Babel→esbuild, Nuxtに依存したRuntimeモジュール→Nitro

モジュールバンドラーはWebpack4からViteに更新しました。Viteは以下の機能をサポートします。

- 開発中の Hot Module Replacement（画面の再描画なしに JS の変更をブラウザに適用する機能）
- 本番用にコードをバンドルするモジュールバンドラー

実際に触ってみて、サーバの立ち上げ時間とリロードして画面が更新されるまでの時間が早くなったと感じました。

トランスパイラはBabelからesbuildに更新しました。
esbuildは、レガシーなブラウザをサポートしながら最新の JavaScript 構文を記述するためのトランスパイラです。

Runtimeモジュールは、Nuxtに依存したRuntimeモジュールからNitroエンジンサーバに更新しました。
まだ開発段階なので実際に早くなったかどうかはわかりませんが、[公式ドキュメント](https://v3.nuxtjs.org/migration/server)によると今回の変更によりパフォーマンスが高くなるそうです。

## 参考サイト

- 公式ドキュメント
  - [https://v3.nuxtjs.org/](https://v3.nuxtjs.org/)
  - [https://nuxtjs.org/](https://nuxtjs.org/)
- 移行ガイド
  - [https://v3-migration.vuejs.org/](https://v3-migration.vuejs.org/)
  - [https://v3.nuxtjs.org/migration/overview/](https://v3.nuxtjs.org/migration/overview/)
