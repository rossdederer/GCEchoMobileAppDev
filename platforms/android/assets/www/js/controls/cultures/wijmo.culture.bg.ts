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
 * Wijmo culture file: bg (Bulgarian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'лв.', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'],
                daysAbbr: ['нед', 'пон', 'вт', 'ср', 'четв', 'пет', 'съб'],
                months: ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'],
                monthsAbbr: ['яну', 'фев', 'мар', 'апр', 'май', 'юни', 'юли', 'авг', 'сеп', 'окт', 'ное', 'дек'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['след новата ера'],
                patterns: {
                    d: 'd.M.yyyy "г."', D: 'dd MMMM yyyy "г."',
                    f: 'dd MMMM yyyy "г." H:mm', F: 'dd MMMM yyyy "г." H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM yyyy "г."', Y: 'MMMM yyyy "г."', 
                    g: 'd.M.yyyy "г." H:mm', G: 'd.M.yyyy "г." H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} позиции избрани'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} елементи)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Възходящо',
            descending: '\u2193 Низходящо',
            apply: 'Приложи',
            clear: 'Изчисти',
            conditions: 'Филтриране по състояние',
            values: 'Филтриране по стойност',

            // value filter
            search: 'Търсене',
            selectAll: 'Избери всички',
            null: '(нищо)',

            // condition filter
            header: 'Показване на елементи със стойност',
            and: 'И',
            or: 'Или',
            stringOperators: [
                { name: '(не е зададено)', op: null },
                { name: 'Е равно на', op: 0 },
                { name: 'Не е равно на', op: 1 },
                { name: 'Започва с', op: 6 },
                { name: 'Завършва с', op: 7 },
                { name: 'Съдържа', op: 8 },
                { name: 'Не съдържа', op: 9 }
            ],
            numberOperators: [
                { name: '(не е зададено)', op: null },
                { name: 'Е равно на', op: 0 },
                { name: 'Не е равно на', op: 1 },
                { name: 'Е по-голямо от', op: 2 },
                { name: 'Е по-голямо или равно на', op: 3 },
                { name: 'Е по-малко от', op: 4 },
                { name: 'Е по-малко или равно на', op: 5 }
            ],
            dateOperators: [
                { name: '(не е зададено)', op: null },
                { name: 'Е равно на', op: 0 },
                { name: 'Е преди', op: 4 },
                { name: 'Е след', op: 3 }
            ],
            booleanOperators: [
                { name: '(не е зададено)', op: null },
                { name: 'Е равно на', op: 0 },
                { name: 'Не е равно на', op: 1 }
            ]
        }
    };
};
