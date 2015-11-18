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
* Wijmo culture file: sk (Slovak)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'EUR', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'],
                daysAbbr: ['ne', 'po', 'ut', 'st', 'št', 'pi', 'so'],
                months: ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'],
                monthsAbbr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                am: ['dop.', 'd'],
                pm: ['odp.', 'o'],
                eras: ['n. l.'],
                patterns: {
                    d: 'd.M.yyyy', D: 'd. MMMM yyyy',
                    f: 'd. MMMM yyyy H:mm', F: 'd. MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd.M.yyyy H:mm', G: 'd.M.yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} položiek vybraného'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} položky)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Vzostupne',
            descending: '\u2193 Zostupne',
            apply: 'Použiť',
            clear: 'Vymazať',
            conditions: 'Filtrovať podľa podmienky',
            values: 'Filtrovať podľa hodnoty',
            // value filter
            search: 'Hľadať',
            selectAll: 'Vybrať všetko',
            null: '(nič)',
            // condition filter
            header: 'Zobraziť položky, kde hodnota',
            and: 'a',
            or: 'alebo',
            stringOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 },
                { name: 'Začína na', op: 6 },
                { name: 'Končí na', op: 7 },
                { name: 'Obsahuje', op: 8 },
                { name: 'Neobsahuje', op: 9 }
            ],
            numberOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 },
                { name: 'Je väčšie ako', op: 2 },
                { name: 'Je väčšie ako alebo rovné', op: 3 },
                { name: 'Je menšie ako', op: 4 },
                { name: 'Je menšie ako alebo rovné', op: 5 }
            ],
            dateOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Je pred', op: 4 },
                { name: 'Je po', op: 3 }
            ],
            booleanOperators: [
                { name: '(nenastavené)', op: null },
                { name: 'Rovná sa', op: 0 },
                { name: 'Nerovná sa', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.sk.js.map

