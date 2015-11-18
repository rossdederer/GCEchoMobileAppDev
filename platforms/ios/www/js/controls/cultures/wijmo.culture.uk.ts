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
 * Wijmo culture file: uk (Ukrainian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '₴', pattern: ['-n$', 'n$'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'],
                daysAbbr: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                monthsAbbr: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['н.е.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'd MMMM yyyy" р."',
                    f: 'd MMMM yyyy" р." H:mm', F: 'd MMMM yyyy" р." H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM yyyy" р."', Y: 'MMMM yyyy" р."', 
                    g: 'dd.MM.yyyy H:mm', G: 'dd.MM.yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} пунктів обраний'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} елементи)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 У порядку зростання',
            descending: '\u2193 У порядку спадання',
            apply: 'Застосувати',
            clear: 'Очистити',
            conditions: 'Фільтрувати за умовою',
            values: 'Фільтрувати за значенням',

            // value filter
            search: 'Пошук',
            selectAll: 'Шукати все',
            null: '(нічого)',

            // condition filter
            header: 'Показати елементи зі значенням',
            and: 'Та',
            or: 'Або',
            stringOperators: [
                { name: '(не встановлено)', op: null },
                { name: 'Дорівнює', op: 0 },
                { name: 'Не дорівнює', op: 1 },
                { name: 'Починається з', op: 6 },
                { name: 'Закінчується на', op: 7 },
                { name: 'Містить', op: 8 },
                { name: 'Не містить', op: 9 }
            ],
            numberOperators: [
                { name: '(не встановлено)', op: null },
                { name: 'Дорівнює', op: 0 },
                { name: 'Не дорівнює', op: 1 },
                { name: 'Більше', op: 2 },
                { name: 'Більше або дорівнює', op: 3 },
                { name: 'Менше', op: 4 },
                { name: 'Менше або дорівнює', op: 5 }
            ],
            dateOperators: [
                { name: '(не встановлено)', op: null },
                { name: 'Дорівнює', op: 0 },
                { name: 'До', op: 4 },
                { name: 'Після', op: 3 }
            ],
            booleanOperators: [
                { name: '(не встановлено)', op: null },
                { name: 'Дорівнює', op: 0 },
                { name: 'Не дорівнює', op: 1 }
            ]
        }
    };
};
