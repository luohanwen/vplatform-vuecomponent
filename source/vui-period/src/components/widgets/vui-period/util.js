import dateUtil from './utils/date';

/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

//获取第几周
export const getWeekIndex = function (date) {
    var year = date.getFullYear(),
        month = date.getMonth(),
        days = date.getDate();
    //那一天是那一年中的第多少天
    for (var i = 0; i < month; i++) {
        days += getMonthDays(year, i);
    }

    //那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    var week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / 7);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }

    return week;
};

//根据年份和第几周获取对应的日期对象（每一周的第一天）
export const getDateByWeekNum = function (year, num) {
    const date = new Date(year, 0, 1);
    const timeDiff = 3600 * 1000 * 24 * (7 * num - 7);
    date.setTime(date.getTime() + timeDiff);
    return date;
}


export const toDate = function (date) {
    let _date = new Date(date);
    // IE patch start (#1422)
    if (isNaN(_date.getTime()) && typeof date === 'string') {
        _date = date.split('-').map(Number);
        _date[1] += 1;
        _date = new Date(..._date);
    }
    // IE patch end

    if (isNaN(_date.getTime())) return null;
    return _date;
};

export const clearHours = function (time) {
    const cloneDate = new Date(time);
    cloneDate.setHours(0, 0, 0, 0);
    return cloneDate.getTime();
};

export const isInRange = (time, a, b) => {
    if (!a || !b) return false;
    const [start, end] = [a, b].sort();
    return time >= start && time <= end;
};

export const formatDate = function (date, format) {
    date = toDate(date);
    if (!date) return '';
    return dateUtil.format(date, format || 'yyyy-MM-dd');
};

export const parseDate = function (string, format) {
    return dateUtil.parse(string, format || 'yyyy-MM-dd');
};

export const getDayCountOfMonth = function (year, month) {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = function (date) {
    const temp = new Date(date.getTime());
    temp.setDate(1);
    return temp.getDay();
};

export const siblingMonth = function (src, diff) {
    const temp = new Date(src); // lets copy it so we don't change the original
    const newMonth = temp.getMonth() + diff;
    const newMonthDayCount = getDayCountOfMonth(temp.getFullYear(), newMonth);
    if (newMonthDayCount < temp.getDate()) {
        temp.setDate(newMonthDayCount);
    }
    temp.setMonth(newMonth);

    return temp;
};

export const prevMonth = function (src) {
    return siblingMonth(src, -1);
};

export const nextMonth = function (src) {
    return siblingMonth(src, 1);
};

export const initTimeDate = function () {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
};

export const formatDateLabels = (function () {
    /*
      Formats:
      yyyy - 4 digit year
      m - month, numeric, 1 - 12
      mm - month, numeric, 01 - 12
      mmm - month, 3 letters, as in `toLocaleDateString`
      Mmm - month, 3 letters, capitalize the return from `toLocaleDateString`
      mmmm - month, full name, as in `toLocaleDateString`
      Mmmm - month, full name, capitalize the return from `toLocaleDateString`
    */

    const formats = {
        yyyy: date => date.getFullYear(),
        m: date => date.getMonth() + 1,
        mm: date => ('0' + (date.getMonth() + 1)).slice(-2),
        mmm: (date, locale) => {
            const monthName = date.toLocaleDateString(locale, {
                month: 'long'
            });
            return monthName.slice(0, 3);
        },
        Mmm: (date, locale) => {
            const monthName = date.toLocaleDateString(locale, {
                month: 'long'
            });
            return (monthName[0].toUpperCase() + monthName.slice(1).toLowerCase()).slice(0, 3);
        },
        mmmm: (date, locale) =>
            date.toLocaleDateString(locale, {
                month: 'long'
            }),
        Mmmm: (date, locale) => {
            const monthName = date.toLocaleDateString(locale, {
                month: 'long'
            });
            return monthName[0].toUpperCase() + monthName.slice(1).toLowerCase();
        }
    };
    const formatRegex = new RegExp(['yyyy', 'Mmmm', 'mmmm', 'Mmm', 'mmm', 'mm', 'm'].join('|'), 'g');

    return function (locale, format, date) {
        const componetsRegex = /(\[[^\]]+\])([^\[\]]+)(\[[^\]]+\])/;
        const components = format.match(componetsRegex).slice(1);
        const separator = components[1];
        const labels = [components[0], components[2]].map(component => {
            const label = component.replace(/\[[^\]]+\]/, str => {
                return str.slice(1, -1).replace(formatRegex, match => formats[match](date, locale));
            });
            return {
                label: label,
                type: component.indexOf('yy') != -1 ? 'year' : 'month'
            };
        });
        return {
            separator: separator,
            labels: labels
        };
    };
})();

// Parsers and Formaters
export const DEFAULT_FORMATS = {
    date: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    year: 'yyyy',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
    timerange: 'HH:mm:ss',
    daterange: 'yyyy-MM-dd',
    datetimerange: 'yyyy-MM-dd HH:mm:ss'
};

export const RANGE_SEPARATOR = ' - ';

const DATE_FORMATTER = function (value, format) {
    return formatDate(value, format);
};
const WEEK_FORMATTER = function (value, format) {
    const date = toDate(value);
    if (!date) return '';
    const year = date.getFullYear();
    const weekNum = getWeekIndex(date);
    return `${year}年第${weekNum}周`;
};
const DATE_PARSER = function (text, format) {
    return parseDate(text, format);
};
const RANGE_FORMATTER = function (value, format) {
    if (Array.isArray(value) && value.length === 2) {
        const start = value[0];
        const end = value[1];

        if (start && end) {
            return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
        }
    } else if (!Array.isArray(value) && value instanceof Date) {
        return formatDate(value, format);
    }
    return '';
};
const RANGE_PARSER = function (text, format) {
    const array = Array.isArray(text) ? text : text.split(RANGE_SEPARATOR);
    if (array.length === 2) {
        const range1 = array[0];
        const range2 = array[1];

        return [
            range1 instanceof Date ? range1 : parseDate(range1, format),
            range2 instanceof Date ? range2 : parseDate(range2, format),
        ];
    }
    return [];
};

export const TYPE_VALUE_RESOLVER_MAP = {
    default: {
        formatter(value) {
            if (!value) return '';
            return '' + value;
        },
        parser(text) {
            if (text === undefined || text === '') return null;
            return text;
        }
    },
    date: {
        formatter: DATE_FORMATTER,
        parser: DATE_PARSER
    },
    datetime: {
        formatter: DATE_FORMATTER,
        parser: DATE_PARSER
    },
    daterange: {
        formatter: RANGE_FORMATTER,
        parser: RANGE_PARSER
    },
    datetimerange: {
        formatter: RANGE_FORMATTER,
        parser: RANGE_PARSER
    },
    timerange: {
        formatter: RANGE_FORMATTER,
        parser: RANGE_PARSER
    },
    time: {
        formatter: DATE_FORMATTER,
        parser: DATE_PARSER
    },
    month: {
        formatter: DATE_FORMATTER,
        parser: DATE_PARSER
    },
    year: {
        formatter: DATE_FORMATTER,
        parser: DATE_PARSER
    },
    week: {
        formatter: WEEK_FORMATTER,
        parser: DATE_PARSER
    },
    multiple: {
        formatter: (value, format) => {
            return value.filter(Boolean).map(date => formatDate(date, format)).join(',');
        },
        parser: (value, format) => {
            const values = typeof value === 'string' ? value.split(',') : value;
            return values.map(value => {
                if (value instanceof Date) return value;
                if (typeof value === 'string') value = value.trim();
                else if (typeof value !== 'number' && !value) value = '';
                return parseDate(value, format);
            });
        }
    },
    number: {
        formatter(value) {
            if (!value) return '';
            return '' + value;
        },
        parser(text) {
            let result = Number(text);

            if (!isNaN(text)) {
                return result;
            } else {
                return null;
            }
        }
    }
};

