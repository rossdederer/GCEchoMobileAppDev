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
 * Wijmo culture file: nl (Dutch)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['$ -n', '$ n'] }
            },
            calendar: {
                '/': '-',
                ':': ':',
                firstDay: 1,
                days: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
                daysAbbr: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
                months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
                monthsAbbr: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['n.Chr.'],
                patterns: {
                    d: 'd-M-yyyy', D: 'dddd d MMMM yyyy',
                    f: 'dddd d MMMM yyyy HH:mm', F: 'dddd d MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'd-M-yyyy HH:mm', G: 'd-M-yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} geselecteerde artikelen'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} items)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Oplopend',
            descending: '\u2193 Aflopend',
            apply: 'Toepassen',
            clear: 'Wissen',
            conditions: 'Filteren op voorwaarde',
            values: 'Filteren op waarde',

            // value filter
            search: 'Zoeken',
            selectAll: 'Alles selecteren',
            null: '(niets)',

            // condition filter
            header: 'Geef items weer waar de waarde',
            and: 'En',
            or: 'Of',
            stringOperators: [
                { name: '(niet ingesteld)', op: null },
                { name: 'Gelijk aan', op: 0 },
                { name: 'Niet gelijk aan', op: 1 },
                { name: 'Begint met', op: 6 },
                { name: 'Eindigt op', op: 7 },
                { name: 'Bevat', op: 8 },
                { name: 'Bevat niet', op: 9 }
            ],
            numberOperators: [
                { name: '(niet ingesteld)', op: null },
                { name: 'Gelijk aan', op: 0 },
                { name: 'Niet gelijk aan', op: 1 },
                { name: 'Is groter dan', op: 2 },
                { name: 'Is groter dan of gelijk aan', op: 3 },
                { name: 'Is kleiner dan', op: 4 },
                { name: 'Is kleiner dan of gelijk aan', op: 5 }
            ],
            dateOperators: [
                { name: '(niet ingesteld)', op: null },
                { name: 'Gelijk aan', op: 0 },
                { name: 'Is voor', op: 4 },
                { name: 'Is na', op: 3 }
            ],
            booleanOperators: [
                { name: '(niet ingesteld)', op: null },
                { name: 'Gelijk aan', op: 0 },
                { name: 'Niet gelijk aan', op: 1 }
            ]
        }
    };
};
