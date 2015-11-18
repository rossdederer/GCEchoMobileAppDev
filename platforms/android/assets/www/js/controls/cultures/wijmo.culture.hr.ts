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
 * Wijmo culture file: hr (Croatian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: 'kn', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
                daysAbbr: ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'],
                months: ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'],
                monthsAbbr: ['sij', 'vlj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['n.e.'],
                patterns: {
                    d: 'd.M.yyyy.', D: 'd. MMMM yyyy.',
                    f: 'd. MMMM yyyy. H:mm', F: 'd. MMMM yyyy. H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM', 
                    y: 'MMMM, yyyy', Y: 'MMMM, yyyy', 
                    g: 'd.M.yyyy. H:mm', G: 'd.M.yyyy. H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} stavki odabrano'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} stavke)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Uzlazno',
            descending: '\u2193 Silazno',
            apply: 'Primijeni',
            clear: 'Očisti',
            conditions: 'Filtriraj prema uvjetu',
            values: 'Filtriraj prema vrijednosti',

            // value filter
            search: 'Traži',
            selectAll: 'Odaberi sve',
            null: '(ništa)',

            // condition filter
            header: 'Prikaži stavke gdje je vrijednost',
            and: 'I',
            or: 'ili',
            stringOperators: [
                { name: '(nije postavljeno)', op: null },
                { name: 'Jednako', op: 0 },
                { name: 'Nije jednako', op: 1 },
                { name: 'Počinje s', op: 6 },
                { name: 'Završava s', op: 7 },
                { name: 'Sadrži', op: 8 },
                { name: 'Ne sadrži', op: 9 }
            ],
            numberOperators: [
                { name: '(nije postavljeno)', op: null },
                { name: 'Jednako', op: 0 },
                { name: 'Nije jednako', op: 1 },
                { name: 'Veće od', op: 2 },
                { name: 'Veće od ili jednako', op: 3 },
                { name: 'Manje od', op: 4 },
                { name: 'Manje od ili jednako', op: 5 }
            ],
            dateOperators: [
                { name: '(nije postavljeno)', op: null },
                { name: 'Jednako', op: 0 },
                { name: 'Prije', op: 4 },
                { name: 'Poslije', op: 3 }
            ],
            booleanOperators: [
                { name: '(nije postavljeno)', op: null },
                { name: 'Jednako', op: 0 },
                { name: 'Nije jednako', op: 1 }
            ]
        }
    };
};
