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
 * Wijmo culture file: no (Norwegian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'kr', pattern: ['$ -n', '$ n'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
                daysAbbr: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
                months: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['e.Kr.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'd. MMMM yyyy',
                    f: 'd. MMMM yyyy HH:mm', F: 'd. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementer valgt'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} artikler)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Stigende',
            descending: '\u2193 Synkende',
            apply: 'Bruk',
            clear: 'Fjern',
            conditions: 'Filtrer etter tilstand',
            values: 'Filtrer etter verdi',

            // value filter
            search: 'Søk',
            selectAll: 'Velg alle',
            null: '(ingenting)',

            // condition filter
            header: 'Vis elementer der verdien',
            and: 'og',
            or: 'eller',
            stringOperators: [
                { name: '(ikke angitt)', op: null },
                { name: 'Tilsvarer', op: 0 },
                { name: 'Tilsvarer ikke', op: 1 },
                { name: 'Begynner med', op: 6 },
                { name: 'Slutter med', op: 7 },
                { name: 'Inneholder', op: 8 },
                { name: 'Inneholder ikke', op: 9 }
            ],
            numberOperators: [
                { name: '(ikke angitt)', op: null },
                { name: 'Tilsvarer', op: 0 },
                { name: 'Tilsvarer ikke', op: 1 },
                { name: 'Er større enn', op: 2 },
                { name: 'Er større enn eller lik som', op: 3 },
                { name: 'Er mindre enn', op: 4 },
                { name: 'Er mindre enn eller lik som', op: 5 }
            ],
            dateOperators: [
                { name: '(ikke angitt)', op: null },
                { name: 'Tilsvarer', op: 0 },
                { name: 'Er før', op: 4 },
                { name: 'Er etter', op: 3 }
            ],
            booleanOperators: [
                { name: '(ikke angitt)', op: null },
                { name: 'Tilsvarer', op: 0 },
                { name: 'Tilsvarer ikke', op: 1 }
            ]
        }
    };
};
