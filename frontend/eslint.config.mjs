import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Matches the strictness of the previous .eslintrc.json ("extends": "next/core-web-vitals")
// exactly — deliberately not adding eslint-config-next/typescript's stricter TypeScript rules
// (e.g. no-explicit-any) here, since that would fail on ~70 pre-existing call sites unrelated
// to this Next.js version upgrade. Worth adopting later as its own deliberate cleanup pass.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
