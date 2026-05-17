import { isObject } from "./utils";

export function mergeDeep<T extends object>(...sources: T[]): T {
  return sources.reduce(
    (sourceAccum, newSource) => mergeDeepInternal(sourceAccum, newSource) as T,
  );
}

export function mergeDeepWithDefault<T extends object>(
  target: T,
  ...sources: T[]
): T {
  return mergeDeep(target, ...sources);
}

function mergeDeepInternal(target: object, source: object = {}): object {
  const output = { ...target } as Record<string, unknown>;
  if (isObject(target) && isObject(source)) {
    const sourceRecord = source as Record<string, unknown>;
    const targetRecord = target as Record<string, unknown>;

    Object.keys(sourceRecord).forEach((key) => {
      const sourceValue = sourceRecord[key];
      if (isObject(sourceValue)) {
        if (!(key in targetRecord)) {
          Object.assign(output, {
            [key]: sourceValue,
          });
        } else {
          output[key] = mergeDeep(
            targetRecord[key] as object,
            sourceValue as object,
          );
        }
      } else {
        Object.assign(output, {
          [key]: sourceValue,
        });
      }
    });
  }
  return output;
}

/* c8 ignore start */
/* c8 ignore stop */
