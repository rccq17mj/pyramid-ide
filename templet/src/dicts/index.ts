/**
 * 数据字典模型
 */
export interface IDict {
  value: string;
  label: string;
}

/**
 * 翻译字典
 * @param dictList
 * @param value
 */
export function DICT_TRANSLATE(dictList: IDict[], value: number | string): string {
  if (value !== 0 && !value) {
    return '';
  }

  let label = '';

  dictList.forEach(dict => {
    if (dict.value.toString() === value.toString()) {
      label = dict.label;
    }
  });

  return label;
}
