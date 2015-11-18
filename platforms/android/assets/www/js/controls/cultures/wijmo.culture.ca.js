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
* Wijmo culture file: ca (Catalan)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
                daysAbbr: ['dg.', 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.'],
                months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
                monthsAbbr: ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['dC'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd, d MMMM" de "yyyy',
                    f: 'dddd, d MMMM" de "yyyy H:mm', F: 'dddd, d MMMM" de "yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM" de "yyyy', Y: 'MMMM" de "yyyy',
                    g: 'dd/MM/yyyy H:mm', G: 'dd/MM/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} articles seleccionats'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} elements)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Ascendent',
            descending: '\u2193 Descendent',
            apply: 'Aplica',
            clear: 'Esborra',
            conditions: 'Filtra per condició',
            values: 'Filtra per valor',
            // value filter
            search: 'Cerca',
            selectAll: 'Selecciona-ho tot',
            null: '(res)',
            // condition filter
            header: 'Mostra elements amb el valor',
            and: 'I',
            or: 'O',
            stringOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 },
                { name: 'Comença amb', op: 6 },
                { name: 'Acaba amb', op: 7 },
                { name: 'Conté', op: 8 },
                { name: 'No conté', op: 9 }
            ],
            numberOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 },
                { name: 'És més gran que', op: 2 },
                { name: 'És més gran o igual que', op: 3 },
                { name: 'És més petit que', op: 4 },
                { name: 'És més petit o igual que', op: 5 }
            ],
            dateOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'És anterior a', op: 4 },
                { name: 'És posterior a', op: 3 }
            ],
            booleanOperators: [
                { name: '(sense definir)', op: null },
                { name: 'És igual a', op: 0 },
                { name: 'No és igual a', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.ca.js.map

