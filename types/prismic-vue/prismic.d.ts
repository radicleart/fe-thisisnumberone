import { getApi } from 'prismic-javascript'
import { DefaultClient } from 'prismic-javascript/d.ts/client'

import Vue from 'vue'

type ThenArg<T> = T extends Promise<infer U> ? U : T
type PrismicAPIPromise = ReturnType<typeof getApi>
type PrismicAPI = ThenArg<PrismicAPIPromise>

type ElementType =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'paragraph'
  | 'preformatted'
  | 'strong'
  | 'em'
  | 'list-item'
  | 'o-list-item'
  | 'group-list-item'
  | 'group-o-list-item'
  | 'image'
  | 'embed'
  | 'hyperlink'
  | 'label'
  | 'span'

type Elements = { [key in ElementType]: string }

type HTMLSerializer<T> = (type: ElementType, element: any, text: string | null, children: T[], index: number) => T

interface RichText {
  Elements: Elements
  asHtml(richText: any, linkResolver?: (doc: any) => string, serializer?: HTMLSerializer<string>): string
  asText(richText: any, joinString?: string): string
}

interface Link {
  url(link: any, linkResolver?: (doc: any) => string): string
}

interface VuePrismic {
  endpoint: string
  linkResolver: (doc: any) => string
  htmlSerializer: HTMLSerializer<string>
  client: DefaultClient
  richTextAsPlain: (field: string) => string
}

type PrismicVue<T> = VuePrismic & T

declare module 'vue/types/vue' {
  interface Vue {
    $prismic: PrismicVue<PrismicAPI>
  }
}
