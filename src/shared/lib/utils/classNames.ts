export type Mods = Record<string, boolean | string | undefined>;

/**
 * Микс классов:
 * cls - основной
 * additional - доп. массив
 * mods - объкт, где классы применяются в зависимости от условий
 */
export function classNames(cls: string, additional: Array<string | undefined> = [], mods: Mods = {}): string {
  const filteredMods: string[] = Object.entries(mods)
    .filter(([ _, flag ]) => Boolean(flag))
    .map(([ className, _ ]) => className);

  return [
    cls,
    ...additional.filter(Boolean),
    ...filteredMods,
  ].join(' ');
}
