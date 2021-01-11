/**
 * @returns Promise<{}>
 */
export function get() {
  alert('load');
  return fetch('foo');
}