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
 * Wijmo culture file: gl (Galician)
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
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'],
                daysAbbr: ['dom', 'luns', 'mar', 'mér', 'xov', 'ven', 'sáb'],
                months: ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'],
                monthsAbbr: ['xan', 'feb', 'mar', 'abr', 'maio', 'xuño', 'xul', 'ago', 'set', 'out', 'nov', 'dec'],
                am: ['a.m.', 'a'],
                pm: ['p.m.', 'p'],
                eras: ['d.C.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd, dd" de "MMMM" de "yyyy',
                    f: 'dddd, dd" de "MMMM" de "yyyy H:mm', F: 'dddd, dd" de "MMMM" de "yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd" de "MMMM', M: 'd" de "MMMM', 
                    y: 'MMMM" de "yyyy', Y: 'MMMM" de "yyyy', 
                    g: 'dd/MM/yyyy H:mm', G: 'dd/MM/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementos seleccionados'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} elementos)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Ascendente',
            descending: '\u2193 Descendente',
            apply: 'Aplicar',
            clear: 'Borrar',
            conditions: 'Filtrar por condición',
            values: 'Filtrar por valor',

            // value filter
            search: 'Buscar',
            selectAll: 'Seleccionar todo',
            null: '(nada)',

            // condition filter
            header: 'Mostrar elementos onde o valor',
            and: 'E',
            or: 'Ou',
            stringOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 },
                { name: 'Comeza por', op: 6 },
                { name: 'Finaliza con', op: 7 },
                { name: 'Contén', op: 8 },
                { name: 'Non contén', op: 9 }
            ],
            numberOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 },
                { name: 'É maior que', op: 2 },
                { name: 'É maior que ou igual a', op: 3 },
                { name: 'É menor que', op: 4 },
                { name: 'É menor que ou igual a', op: 5 }
            ],
            dateOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'É anterior a', op: 4 },
                { name: 'É posterior a', op: 3 }
            ],
            booleanOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 }
            ]
        }
    };
};
