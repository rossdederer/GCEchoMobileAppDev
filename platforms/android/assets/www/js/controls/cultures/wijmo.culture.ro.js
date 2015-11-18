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
* Wijmo culture file: ro (Romanian)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: 'lei', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
                daysAbbr: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
                months: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
                monthsAbbr: ['ian.', 'feb.', 'mar.', 'apr.', 'mai.', 'iun.', 'iul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'],
                am: ['a.m.', 'a'],
                pm: ['p.m.', 'p'],
                eras: ['A.D.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'd MMMM yyyy',
                    f: 'd MMMM yyyy H:mm', F: 'd MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd.MM.yyyy H:mm', G: 'dd.MM.yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} articole selectat'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} articole)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Crescător',
            descending: '\u2193 Descrescător',
            apply: 'Aplicare',
            clear: 'Golire',
            conditions: 'Filtrare după stare',
            values: 'Filtrare după valoare',
            // value filter
            search: 'Căutare',
            selectAll: 'Selectare totală',
            null: '(nimic)',
            // condition filter
            header: 'Indică articolele unde valoarea',
            and: 'Și',
            or: 'Sau',
            stringOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 },
                { name: 'Începe cu', op: 6 },
                { name: 'Se încheie cu', op: 7 },
                { name: 'Conține', op: 8 },
                { name: 'Nu conține', op: 9 }
            ],
            numberOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 },
                { name: 'Este mai mare decât', op: 2 },
                { name: 'Este mai mare decât sau egală cu', op: 3 },
                { name: 'Este mai mică decât', op: 4 },
                { name: 'Este mai mică decât sau egală cu', op: 5 }
            ],
            dateOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Este înainte de', op: 4 },
                { name: 'Este după', op: 3 }
            ],
            booleanOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.ro.js.map

