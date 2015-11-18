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
 * Wijmo culture file: sl (Slovenian)
 */
module wijmo {
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
                days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
                daysAbbr: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
                months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['našega štetja'],
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
            itemsSelected: '{count:n0} postavke izbrali'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} artikli)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Naraščajoče',
            descending: '\u2193 Padajoče',
            apply: 'Uporabi',
            clear: 'Počisti',
            conditions: 'Filtriraj glede na pogoj',
            values: 'Filtriraj glede na vrednost',

            // value filter
            search: 'Iskanje',
            selectAll: 'Izberi vse',
            null: '(prazno)',

            // condition filter
            header: 'Prikaži elemente, kjer je vrednost',
            and: 'In',
            or: 'Ali',
            stringOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 },
                { name: 'Se začne z', op: 6 },
                { name: 'Se konča z', op: 7 },
                { name: 'Vsebuje', op: 8 },
                { name: 'Ne vsebuje', op: 9 }
            ],
            numberOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 },
                { name: 'Je večje od', op: 2 },
                { name: 'Je večje ali enako', op: 3 },
                { name: 'Je manjše od', op: 4 },
                { name: 'Je manjše ali enako', op: 5 }
            ],
            dateOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Je pred', op: 4 },
                { name: 'Je po', op: 3 }
            ],
            booleanOperators: [
                { name: '(ni določeno)', op: null },
                { name: 'Je enako', op: 0 },
                { name: 'Ni enako', op: 1 }
            ]
        }
    };
};
