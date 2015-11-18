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
* Wijmo culture file: fi (Finnish)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
                daysAbbr: ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
                months: ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'],
                monthsAbbr: ['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['jKr'],
                patterns: {
                    d: 'd.M.yyyy', D: 'd. MMMM yyyy',
                    f: 'd. MMMM yyyy H:mm', F: 'd. MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd"." MMMM', M: 'd"." MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd.M.yyyy H:mm', G: 'd.M.yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} kohdetta valittu'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} tuotteet)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Nouseva',
            descending: '\u2193 Laskeva',
            apply: 'Käytä',
            clear: 'Tyhjennä',
            conditions: 'Suodata kunnon mukaan',
            values: 'Suodata arvon mukaan',
            // value filter
            search: 'Haku',
            selectAll: 'Valitse kaikki',
            null: '(ei mitään)',
            // condition filter
            header: 'Näytä kohteet, joissa arvo',
            and: 'Ja',
            or: 'Tai',
            stringOperators: [
                { name: '(ei asetettu)', op: null },
                { name: 'On yhtä kuin', op: 0 },
                { name: 'On eri suuri kuin', op: 1 },
                { name: 'Alkaa merkillä', op: 6 },
                { name: 'Päättyy merkkiin', op: 7 },
                { name: 'Sisältää', op: 8 },
                { name: 'Ei sisällä', op: 9 }
            ],
            numberOperators: [
                { name: '(ei asetettu)', op: null },
                { name: 'On yhtä kuin', op: 0 },
                { name: 'On eri suuri kuin', op: 1 },
                { name: 'On suurempi kuin', op: 2 },
                { name: 'On suurempi tai yhtä suuri kuin', op: 3 },
                { name: 'On pienempi kuin', op: 4 },
                { name: 'On pienempi tai yhtä suuri kuin', op: 5 }
            ],
            dateOperators: [
                { name: '(ei asetettu)', op: null },
                { name: 'On yhtä kuin', op: 0 },
                { name: 'On ennen', op: 4 },
                { name: 'On jälkeen', op: 3 }
            ],
            booleanOperators: [
                { name: '(ei asetettu)', op: null },
                { name: 'On yhtä kuin', op: 0 },
                { name: 'On eri suuri kuin', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.fi.js.map

