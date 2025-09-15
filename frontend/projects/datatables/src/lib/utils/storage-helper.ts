export function getLocalStorage<T = unknown>(storage: string): T | null {
  return IsJsonString(getDecryptAtob(storage));
}

export function setLocalStorage(storage: string, obj: unknown | null): void {
  if (obj == null) {
    localStorage.removeItem(storage);
  } else {
    localStorage.setItem(storage, btoa(JSON.stringify(obj)));
  }
}

function IsJsonString<T = unknown>(str: string | null): T | null {
  if (str == null) {
    return null;
  }

  let data = null;
  try {
    data = JSON.parse(str) as T;
  } catch (_) {
    return null;
  }
  return data;
}

function getDecryptAtob(storage: string): string | null {
  const data = localStorage.getItem(storage);
  if (!data) {
    return null;
  }

  let str = null;
  try {
    str = atob(data);
  } catch (_) {
    return null;
  }

  return str;
}

export function getPageSizeStorage(
  storageKeyPageSize: string,
  pageSizeOptions: number[],
): number {
  let storageSelectedValue = Math.min(...pageSizeOptions) ?? 10;

  const size = getLocalStorage<string>(storageKeyPageSize);
  if (size) {
    const contains = pageSizeOptions.some(
      (item) => item.toString() === size.toString(),
    );

    if (contains) {
      const sizeParsed = Number(size);
      if (!Number.isNaN(sizeParsed) && sizeParsed > 0) {
        storageSelectedValue = sizeParsed;
      }
    }
  }

  return storageSelectedValue;
}
