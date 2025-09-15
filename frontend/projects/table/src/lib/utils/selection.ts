/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export function selectRows(selected: any[], row: any, comparefn: any): any[] {
  const selectedIndex: number = comparefn(row, selected);

  if (selectedIndex > -1) {
    selected.splice(selectedIndex, 1);
  } else {
    selected.push(row);
  }

  return selected;
}

export function selectRowsBetween(
  selected: any[],
  rows: any[],
  index: number,
  prevIndex: number,
  comparefn: any,
): any[] {
  const reverse = index < prevIndex;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const greater = i >= prevIndex && i <= index;
    const lesser = i <= prevIndex && i >= index;

    let range = { start: 0, end: 0 };
    if (reverse) {
      range = {
        start: index,
        end: prevIndex,
      };
    } else {
      range = {
        start: prevIndex,
        end: index + 1,
      };
    }

    if ((reverse && lesser) || (!reverse && greater)) {
      // if in the positive range to be added to `selected`, and
      // not already in the selected array, add it
      if (i >= range.start && i <= range.end) {
        selected.push(row);
      }
    }
  }

  return selected;
}
