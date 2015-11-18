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
* Wijmo culture file: hi (Hindi)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '₹', pattern: ['$ -n', '$ n'] }
            },
            calendar: {
                '/': '-',
                ':': ':',
                firstDay: 1,
                days: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
                daysAbbr: ['रवि.', 'सोम.', 'मंगल.', 'बुध.', 'गुरु.', 'शुक्र.', 'शनि.'],
                months: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्तूबर', 'नवम्बर', 'दिसम्बर'],
                monthsAbbr: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्तूबर', 'नवम्बर', 'दिसम्बर'],
                am: ['पूर्वाह्न', 'प'],
                pm: ['अपराह्न', 'अ'],
                eras: ['A.D.'],
                patterns: {
                    d: 'dd-MM-yyyy', D: 'dd MMMM yyyy',
                    f: 'dd MMMM yyyy HH:mm', F: 'dd MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'dd MMMM', M: 'dd MMMM',
                    y: 'MMMM, yyyy', Y: 'MMMM, yyyy',
                    g: 'dd-MM-yyyy HH:mm', G: 'dd-MM-yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} आइटम चयनित'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} आइटम)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 आरोही',
            descending: '\u2193 अवरोही',
            apply: 'लागू करें',
            clear: 'साफ़ करें',
            conditions: 'शर्त के अनुसार फ़िल्टर करें',
            values: 'मान के अनुसार फ़िल्टर करें',
            // value filter
            search: 'खोज',
            selectAll: 'सभी चुनें',
            null: '(कुछ नहीं)',
            // condition filter
            header: 'वे आइटम दिखाएँ जहाँ मान',
            and: 'और',
            or: 'या',
            stringOperators: [
                { name: '(सेट नहीं है)', op: null },
                { name: 'बराबर है', op: 0 },
                { name: 'बराबर नहीं है', op: 1 },
                { name: 'इससे आरंभ होता है', op: 6 },
                { name: 'इससे समाप्त होता है', op: 7 },
                { name: 'जिसमें शामिल है', op: 8 },
                { name: 'जिसमें शामिल नहीं है', op: 9 }
            ],
            numberOperators: [
                { name: '(सेट नहीं है)', op: null },
                { name: 'बराबर है', op: 0 },
                { name: 'बराबर नहीं है', op: 1 },
                { name: 'इससे अधिक है', op: 2 },
                { name: 'इससे अधिक या बराबर है', op: 3 },
                { name: 'इससे कम है', op: 4 },
                { name: 'इससे कम या बराबर है', op: 5 }
            ],
            dateOperators: [
                { name: '(सेट नहीं है)', op: null },
                { name: 'बराबर है', op: 0 },
                { name: 'इससे पहले है', op: 4 },
                { name: 'इसके बाद है', op: 3 }
            ],
            booleanOperators: [
                { name: '(सेट नहीं है)', op: null },
                { name: 'बराबर है', op: 0 },
                { name: 'बराबर नहीं है', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.hi.js.map

