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
* Wijmo culture file: it (Italian)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-$ n', '$ n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
                daysAbbr: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
                months: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
                monthsAbbr: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['d.C.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd d MMMM yyyy',
                    f: 'dddd d MMMM yyyy HH:mm', F: 'dddd d MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd/MM/yyyy HH:mm', G: 'dd/MM/yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementi selezionati'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} elementi)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Ordine ascendente',
            descending: '\u2193 Ordine discendente',
            apply: 'Applica',
            clear: 'Cancella',
            conditions: 'Filtra per Condizione',
            values: 'Filtra per Valore',
            // value filter
            search: 'Cerca',
            selectAll: 'Seleziona tutto',
            null: '(niente)',
            // condition filter
            header: 'Mostra elementi ove il valore',
            and: 'e',
            or: 'Oppure',
            stringOperators: [
                { name: '(non impostato)', op: null },
                { name: 'Uguale', op: 0 },
                { name: 'Diverso da', op: 1 },
                { name: 'Inizia con', op: 6 },
                { name: 'Termina con', op: 7 },
                { name: 'Contiene', op: 8 },
                { name: 'Non contiene', op: 9 }
            ],
            numberOperators: [
                { name: '(non impostato)', op: null },
                { name: 'Uguale', op: 0 },
                { name: 'Diverso da', op: 1 },
                { name: 'Sia maggiore di', op: 2 },
                { name: 'Sia maggiore o uguale a', op: 3 },
                { name: 'Sia minore di', op: 4 },
                { name: 'Sia minore o uguale a', op: 5 }
            ],
            dateOperators: [
                { name: '(non impostato)', op: null },
                { name: 'Uguale', op: 0 },
                { name: 'Sia precedente', op: 4 },
                { name: 'Sia successivo', op: 3 }
            ],
            booleanOperators: [
                { name: '(non impostato)', op: null },
                { name: 'Uguale', op: 0 },
                { name: 'Diverso da', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.it.js.map

