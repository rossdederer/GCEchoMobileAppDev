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
 * Wijmo culture file: eu (Basque)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['% -n', '% n'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'],
                daysAbbr: ['ig.', 'al.', 'as.', 'az.', 'og.', 'or.', 'lr.'],
                months: ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'],
                monthsAbbr: ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['K.o.'],
                patterns: {
                    d: 'yyyy/MM/dd', D: 'dddd, yyyy"(e)ko" MMMM"ren" d"a"',
                    f: 'dddd, yyyy"(e)ko" MMMM"ren" d"a" H:mm', F: 'dddd, yyyy"(e)ko" MMMM"ren" d"a" H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'MMMM"ren" d"a"', M: 'MMMM"ren" d"a"', 
                    y: 'yyyy"(e)ko" MMMM', Y: 'yyyy"(e)ko" MMMM', 
                    g: 'yyyy/MM/dd H:mm', G: 'yyyy/MM/dd H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementurik hautatu'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} gaiak)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Goranzkoa',
            descending: '\u2193 Beheranzkoa',
            apply: 'Aplikatu',
            clear: 'Garbitu',
            conditions: 'Iragazi egoeraren arabera',
            values: 'Iragazi balioaren arabera',

            // value filter
            search: 'Bilatu',
            selectAll: 'Hautatu denak',
            null: '(ezer ez)',

            // condition filter
            header: 'Erakutsi gaiak balioaren lekuan',
            and: 'Eta',
            or: 'Edo',
            stringOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 },
                { name: 'Honela hazten da', op: 6 },
                { name: 'Honela bukatzen da', op: 7 },
                { name: 'Barne dauka', op: 8 },
                { name: 'Ez dauka barne', op: 9 }
            ],
            numberOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 },
                { name: 'Handiagoa da', op: 2 },
                { name: 'Handiagoa edo berdina da', op: 3 },
                { name: 'Txikiagoa da', op: 4 },
                { name: 'Txikiagoa edo berdina da', op: 5 }
            ],
            dateOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Honen aurretik', op: 4 },
                { name: 'Honen ondoren', op: 3 }
            ],
            booleanOperators: [
                { name: '(ezarri gabe)', op: null },
                { name: 'Berdina', op: 0 },
                { name: 'Ezberdina', op: 1 }
            ]
        }
    };
};
