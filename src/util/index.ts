export { Logger } from './logger';
export { DataParser } from './data-parser';
export { DataLoaderParser } from './data-loader-parser';
export function pluralize(s: string): string { return /s$/.test(s) ? `${s}es` : `${s}s`; }
export function sort(a: any, b: any): number {
  if(typeof a !== typeof b) return 0;
  if(typeof a === 'string') return a.localeCompare(b);
  if(typeof a === 'number') return a - b;
  if(typeof a === 'boolean') return a === b ? 0 : a ? 1 : -1;
  else return 0;
}
