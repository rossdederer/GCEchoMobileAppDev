/*
    *
    * Wijmo Library 5.20152.90
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    * 
    * Licensed under the Wijmo Commercial License. 
    * sales@wijmo.com
    * http://wijmo.com/products/wijmo-5/license/
    *
    */
/*
 * Wijmo culture file: zh-HK (Chinese (Traditional, Hong Kong SAR))
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: 'HK$', pattern: ['($n)', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 0,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                daysAbbr: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                monthsAbbr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                am: ['上午', '上'],
                pm: ['下午', '下'],
                eras: ['公元'],
                patterns: {
                    d: 'd/M/yyyy', D: 'yyyy"年"M"月"d"日"',
                    f: 'yyyy"年"M"月"d"日" H:mm', F: 'yyyy"年"M"月"d"日" H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'M"月"d"日"', M: 'M"月"d"日"', 
                    y: 'yyyy"年"M"月"', Y: 'yyyy"年"M"月"', 
                    g: 'd/M/yyyy H:mm', G: 'd/M/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0}項被選中'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} 項目)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 由小至大排列',
            descending: '\u2193 由大至小排列',
            apply: '套用',
            clear: '清除',
            conditions: '按狀況篩選',
            values: '按價值篩選',

            // value filter
            search: '搜尋',
            selectAll: '全部選擇',
            null: '(無)',

            // condition filter
            header: '顯示價值如下的項目',
            and: '及',
            or: '或',
            stringOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 },
                { name: '開首為', op: 6 },
                { name: '結尾為', op: 7 },
                { name: '包含', op: 8 },
                { name: '不包含', op: 9 }
            ],
            numberOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 },
                { name: '大於', op: 2 },
                { name: '大於或相等於', op: 3 },
                { name: '少於', op: 4 },
                { name: '少於或相等於', op: 5 }
            ],
            dateOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '先於', op: 4 },
                { name: '後於', op: 3 }
            ],
            booleanOperators: [
                { name: '(無設定)', op: null },
                { name: '相等於', op: 0 },
                { name: '不等於', op: 1 }
            ]
        }
    };
};
