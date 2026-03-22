/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TESTING?: string
  readonly PLAYWRITER_AUTO_CONNECT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
