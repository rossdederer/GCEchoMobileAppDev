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
* Wijmo culture file: de (German)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                daysAbbr: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                monthsAbbr: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['n. Chr.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, d. MMMM yyyy',
                    f: 'dddd, d. MMMM yyyy HH:mm', F: 'dddd, d. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} Artikel ausgewählt'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} Elemente)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Aufsteigend',
            descending: '\u2193 Absteigend',
            apply: 'Anwenden',
            clear: 'Löschen',
            conditions: 'Nach Zustand filtern',
            values: 'Nach Wert filtern',
            // value filter
            search: 'Suche',
            selectAll: 'Alles auswählen',
            null: '(nichts)',
            // condition filter
            header: 'Zeige Elemente mit dem Wert',
            and: 'Und',
            or: 'Oder',
            stringOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 },
                { name: 'Fängt an mit', op: 6 },
                { name: 'Endet mit', op: 7 },
                { name: 'Enthält', op: 8 },
                { name: 'Enthält nicht', op: 9 }
            ],
            numberOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 },
                { name: 'Größer als', op: 2 },
                { name: 'Größer oder gleich', op: 3 },
                { name: 'ist weniger als', op: 4 },
                { name: 'Kleiner oder gleich', op: 5 }
            ],
            dateOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist vor', op: 4 },
                { name: 'Ist nach', op: 3 }
            ],
            booleanOperators: [
                { name: '(nicht eingestellt)', op: null },
                { name: 'Gleich', op: 0 },
                { name: 'Ist nicht gleich', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.de.js.map

