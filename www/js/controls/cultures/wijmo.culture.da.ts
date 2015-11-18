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
 * Wijmo culture file: da (Danish)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'kr.', pattern: ['$ -n', '$ n'] }
            },
            calendar: {
                '/': '-',
                ':': ':',
                firstDay: 1,
                days: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
                daysAbbr: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
                months: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['A.D.'],
                patterns: {
                    d: 'dd-MM-yyyy', D: 'd. MMMM yyyy',
                    f: 'd. MMMM yyyy HH:mm', F: 'd. MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'dd-MM-yyyy HH:mm', G: 'dd-MM-yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} varer valgt'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} emner)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Stigende',
            descending: '\u2193 Faldende',
            apply: 'Anvend',
            clear: 'Ryd',
            conditions: 'Filtrer efter betingelse',
            values: 'Filtrer efter værdi',

            // value filter
            search: 'Søg',
            selectAll: 'Markér alt',
            null: '(intet)',

            // condition filter
            header: 'Vis emner med værdien',
            and: 'Og',
            or: 'Eller',
            stringOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 },
                { name: 'Begynder med', op: 6 },
                { name: 'Slutter med', op: 7 },
                { name: 'Indeholder', op: 8 },
                { name: 'Indeholder ikke', op: 9 }
            ],
            numberOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 },
                { name: 'Større end', op: 2 },
                { name: 'Større end eller lig med', op: 3 },
                { name: 'Mindre end', op: 4 },
                { name: 'Mindre end eller lig med', op: 5 }
            ],
            dateOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Før', op: 4 },
                { name: 'Efter', op: 3 }
            ],
            booleanOperators: [
                { name: '(ikke indstillet)', op: null },
                { name: 'Lig med', op: 0 },
                { name: 'Ikke lig med', op: 1 }
            ]
        }
    };
};
