import { VrcSelectComponent } from '../vrc-select.component';

export interface Select2Group {
  /** label of group */
  label: string;
  /** options list */
  options: Select2Option[];
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: unknown;
}

export interface Select2Option {
  /** value  */
  value: Select2Value;
  /** label of option */
  label: string;
  /** no selectable is disabled */
  disabled?: boolean;
  /** for identification */
  id?: string;
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: unknown;
  /** for identification of main */
  main?: boolean;
}

export type Select2Value =
  | string
  | number
  | boolean
  | { value: string | number; main: boolean };

export type Select2UpdateValue = Select2Value | Select2Value[];

export type Select2Data = (Select2Group | Select2Option)[];

export interface Select2UpdateEvent<
  U extends Select2UpdateValue = Select2Value,
> {
  component: VrcSelectComponent;
  value: U;
  options: Select2Option[];
}

export interface Select2SearchEvent<
  U extends Select2UpdateValue = Select2Value,
> {
  component: VrcSelectComponent;
  value: U;
  search: string;
}

type TOptionsByValue = Select2Value | null | undefined;

export const timeout = 200;

export const unicodePatterns: { l: string; s: RegExp }[] = [
  { l: 'a', s: /[ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ]/gi },
  { l: 'aa', s: /ꜳ/gi },
  { l: 'ae', s: /[æǽǣ]/gi },
  { l: 'ao', s: /ꜵ/gi },
  { l: 'au', s: /ꜷ/gi },
  { l: 'av', s: /[ꜹꜻ]/gi },
  { l: 'ay', s: /ꜽ/gi },
  { l: 'b', s: /[ⓑｂḃḅḇƀƃɓ]/gi },
  { l: 'c', s: /[ⓒｃćĉċčçḉƈȼꜿↄ]/gi },
  { l: 'd', s: /[ⓓｄḋďḍḑḓḏđƌɖɗꝺ]/gi },
  { l: 'dz', s: /[ǳǆ]/gi },
  { l: 'e', s: /[ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ]/gi },
  { l: 'f', s: /[ⓕｆḟƒꝼ]/gi },
  { l: 'g', s: /[ⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ]/gi },
  { l: 'h', s: /[ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ]/gi },
  { l: 'hv', s: /ƕ/gi },
  { l: 'i', s: /[ⓘｉìíîĩīĭİïḯỉǐȉȋịįḭɨı]/gi },
  { l: 'j', s: /[ⓙｊĵǰɉ]/gi },
  { l: 'k', s: /[ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ]/gi },
  { l: 'l', s: /[ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇꝆ]/gi },
  { l: 'lj', s: /ǉ/gi },
  { l: 'm', s: /[ⓜｍḿṁṃɱɯ]/gi },
  { l: 'n', s: /[ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ]/gi },
  { l: 'nj', s: /ǌ/gi },
  { l: 'o', s: /[ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔƟꝋꝍɵ]/gi },
  { l: 'oi', s: /ƣ/gi },
  { l: 'oe', s: /œ/gi },
  { l: 'oo', s: /ꝏ/gi },
  { l: 'ou', s: /ȣ/gi },
  { l: 'p', s: /[ⓟｐṕṗƥᵽꝑꝓꝕ]/gi },
  { l: 'q', s: /[ⓠｑɋꝗꝙ]/gi },
  { l: 'r', s: /[ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ]/gi },
  { l: 's', s: /[ⓢｓßẞśṥŝṡšṧṣṩșşȿꞩꞅẛ]/gi },
  { l: 't', s: /[ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ]/gi },
  { l: 'tz', s: /ꜩ/gi },
  { l: 'u', s: /[ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ]/gi },
  { l: 'v', s: /[ⓥｖṽṿʋꝟʌ]/gi },
  { l: 'vy', s: /ꝡ/gi },
  { l: 'w', s: /[ⓦｗẁẃŵẇẅẘẉⱳ]/gi },
  { l: 'x', s: /[ⓧｘẋẍ]/gi },
  { l: 'y', s: /[ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ]/gi },
  { l: 'z', s: /[ⓩｚźẑżžẓẕƶȥɀⱬꝣ]/gi },
];

const defaultMinCountForSearch = 6;

export class Select2Utils {
  static getOptionByValue(
    data: Select2Data,
    value: TOptionsByValue,
  ): Select2Option | null {
    if (Array.isArray(data)) {
      for (const groupOrOption of data) {
        const options = (groupOrOption as Select2Group).options;
        if (options) {
          for (const option of options) {
            if (option.value === value) {
              return option;
            }
          }
        } else {
          if ((groupOrOption as Select2Option).value === value) {
            return groupOrOption as Select2Option;
          } else if (
            (groupOrOption as Select2Option)?.value ===
            (value as Select2Option)?.value
          ) {
            if ((value as Select2Option).main) {
              (groupOrOption as Select2Option).main = true;
            }
            return groupOrOption as Select2Option;
          }
        }
      }
    }
    return null;
  }

  static getOptionsByValue(
    data: Select2Data,
    value: Select2UpdateValue | null | undefined,
    multiple: boolean | null | undefined,
  ): Select2Option[] | Select2Option | null {
    if (multiple) {
      const values: Select2Value[] = Array.isArray(value) ? value : [];

      let mainOptionAlreadyExists = false;
      for (const item of values as Select2Option[]) {
        if (mainOptionAlreadyExists) {
          delete item.main;
        }
        if (item.main) {
          mainOptionAlreadyExists = true;
        }
      }
      const result: Select2Option[] = [];
      for (const v of values) {
        const option = Select2Utils.getOptionByValue(data, v);
        if (option) {
          result.push(option);
        }
      }
      return result;
    }
    return Select2Utils.getOptionByValue(data, value as TOptionsByValue);
  }

  static getFirstAvailableOption(data: Select2Data): Select2Value | null {
    if (Array.isArray(data)) {
      for (const groupOrOption of data) {
        const options = (groupOrOption as Select2Group).options;
        if (options) {
          for (const option of options) {
            if (!option.disabled) {
              return option.value;
            }
          }
        } else {
          const option = groupOrOption as Select2Option;
          if (!option.disabled) {
            return option.value;
          }
        }
      }
    }
    return null;
  }

  private static getOptionsCount(data: Select2Data): number {
    let count = 0;
    if (Array.isArray(data)) {
      for (const groupOrOption of data) {
        const options = (groupOrOption as Select2Group).options;
        if (options) {
          count += options.length;
        } else {
          count++;
        }
      }
    }
    return count;
  }

  static valueIsNotInFilteredData(
    filteredData: Select2Data,
    value: TOptionsByValue,
  ): boolean {
    if (
      Select2Utils.isNullOrUndefined(value) ||
      Select2Utils.isNullOrUndefined(filteredData)
    ) {
      return true;
    }
    for (const groupOrOption of filteredData) {
      const options = (groupOrOption as Select2Group).options;
      if (options) {
        for (const option of options) {
          if (option.value === value) {
            return false;
          }
        }
      } else {
        if ((groupOrOption as Select2Option).value === value) {
          return false;
        }
      }
    }
    return true;
  }

  static getPreviousOption(
    filteredData: Select2Data,
    hoveringValue: TOptionsByValue,
  ): Select2Option | null {
    let findIt = Select2Utils.isNullOrUndefined(hoveringValue);
    for (let i = filteredData.length - 1; i >= 0; i--) {
      const groupOrOption = filteredData[i];
      const options = (groupOrOption as Select2Group).options;
      if (options) {
        for (let j = options.length - 1; j >= 0; j--) {
          const option = options[j];
          if (findIt) {
            if (!option.disabled) {
              return option;
            }
          }
          if (!findIt) {
            findIt = option.value === hoveringValue;
          }
        }
      } else {
        const option = groupOrOption as Select2Option;
        if (findIt) {
          if (!option.disabled) {
            return option;
          }
        }
        if (!findIt) {
          findIt = option.value === hoveringValue;
        }
      }
    }
    return null;
  }

  static getNextOption(
    filteredData: Select2Data,
    hoveringValue: TOptionsByValue,
  ): Select2Option | null {
    let findIt = Select2Utils.isNullOrUndefined(hoveringValue);
    for (const groupOrOption of filteredData) {
      const options = (groupOrOption as Select2Group).options;
      if (options) {
        for (const option of options) {
          if (findIt) {
            if (!option.disabled) {
              return option;
            }
          } else if (!findIt) {
            findIt = option.value === hoveringValue;
          }
        }
      } else {
        const option = groupOrOption as Select2Option;
        if (findIt) {
          if (!option.disabled) {
            return option;
          }
        } else if (!findIt) {
          findIt = option.value === hoveringValue;
        }
      }
    }
    return null;
  }

  private static isNullOrUndefined(value: unknown): boolean {
    return value === null || value === undefined;
  }

  private static containSearchText(
    label: string,
    searchText: string | null,
    editPattern: ((str: string) => string) | undefined,
  ): boolean {
    if (!searchText) {
      return true;
    }

    const regex = new RegExp(
      Select2Utils.formatPattern(searchText, editPattern),
      'i',
    );
    return regex.exec(Select2Utils.formatSansUnicode(label)) !== null;
  }

  private static protectPattern(str: string): string {
    return str?.replace(/[-[\]{}()*+?.\\^$|]/g, '\\$&');
  }

  private static formatSansUnicode(str: string): string {
    for (const unicodePattern of unicodePatterns) {
      str = str?.replace(unicodePattern.s, unicodePattern.l);
    }
    return str;
  }

  private static formatPattern(
    str: string,
    editPattern: ((str: string) => string) | undefined,
  ): string {
    str = Select2Utils.formatSansUnicode(Select2Utils.protectPattern(str));

    if (editPattern && typeof editPattern === 'function') {
      str = editPattern(str);
    }
    return str;
  }

  static getFilteredData(
    data: Select2Data,
    searchText: string | null,
    editPattern?: (str: string) => string,
  ): Select2Data {
    if (searchText) {
      const result: Select2Data = [];
      for (const groupOrOption of data) {
        const options = (groupOrOption as Select2Group).options;
        if (options) {
          if (
            options.some((group) =>
              Select2Utils.containSearchText(
                group.label,
                searchText,
                editPattern,
              ),
            )
          ) {
            const filteredOptions = options.filter((group) =>
              Select2Utils.containSearchText(
                group.label,
                searchText,
                editPattern,
              ),
            );
            result.push({
              label: groupOrOption.label,
              options: filteredOptions,
            });
          }
        } else if (
          Select2Utils.containSearchText(
            groupOrOption.label,
            searchText,
            editPattern,
          )
        ) {
          result.push(groupOrOption);
        }
      }
      return result;
    } else {
      return data;
    }
  }

  static getFilteredSelectedData(
    data: Select2Data,
    selectedOptions: Select2Option | Select2Option[] | null,
  ): Select2Data {
    const result: Select2Data = [];
    for (const groupOrOption of data) {
      const options = (groupOrOption as Select2Group).options;
      if (options) {
        const filteredOptions = options.filter(
          (group) =>
            Select2Utils.isSelected(selectedOptions, group, true) === 'false',
        );
        if (filteredOptions.length) {
          result.push({
            label: groupOrOption.label,
            options: filteredOptions,
          });
        }
      } else if (
        Select2Utils.isSelected(
          selectedOptions,
          groupOrOption as Select2Option,
          true,
        ) === 'false'
      ) {
        result.push(groupOrOption);
      }
    }
    return result;
  }

  static isSearchboxHiddex(
    data: Select2Data,
    minCountForSearch?: number | string,
  ): boolean {
    if (
      minCountForSearch === '' ||
      minCountForSearch === undefined ||
      minCountForSearch === null ||
      isNaN(+minCountForSearch)
    ) {
      minCountForSearch = defaultMinCountForSearch;
    }
    const optionCount = Select2Utils.getOptionsCount(data);
    return optionCount < +minCountForSearch;
  }

  static isSelected(
    options: Select2Option | Select2Option[] | null,
    option: Select2Option,
    multiple: boolean | null | undefined,
  ): string {
    if (multiple) {
      return options &&
        (options as Select2Option[]).some((op) => op.value === option.value)
        ? 'true'
        : 'false';
    } else {
      return options && option.value === (options as Select2Option).value
        ? 'true'
        : 'false';
    }
  }

  static removeSelection(
    options: Select2Option | Select2Option[] | null,
    option: Select2Option,
  ): void {
    for (let i = 0; i < (options as Select2Option[]).length; i++) {
      if ((options as Select2Option[])[i].value === option.value) {
        (options as Select2Option[]).splice(i, 1);
        return;
      }
    }
  }
}
