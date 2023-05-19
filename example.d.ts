import { HaltType } from './example.js'

declare module './index' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface HaltList extends HaltType {}
}
