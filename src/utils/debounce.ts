/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export function debounce<T extends Function>(cb: T, ms = 250) {
  let h: NodeJS.Timeout;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), ms);
  };
  return <T>(<any>callable);
}
