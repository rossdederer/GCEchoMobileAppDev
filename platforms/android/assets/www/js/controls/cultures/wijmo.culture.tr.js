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
* Wijmo culture file: tr (Turkish)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-%n', '%n'] },
                currency: { decimals: 2, symbol: '₺', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                daysAbbr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
                months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                monthsAbbr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                am: ['', ''],
                pm: ['', ''],
                eras: ['MS'],
                patterns: {
                    d: 'd.M.yyyy', D: 'd MMMM yyyy dddd',
                    f: 'd MMMM yyyy dddd HH:mm', F: 'd MMMM yyyy dddd HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'd.M.yyyy HH:mm', G: 'd.M.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} ürün seçilen'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} öğe)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Artan',
            descending: '\u2193 Azalan',
            apply: 'Uygula',
            clear: 'Temizle',
            conditions: 'Koşula Göre Filtrele',
            values: 'Değere Göre Filtrele',
            // value filter
            search: 'Ara',
            selectAll: 'Tümünü Seç',
            null: '(yok)',
            // condition filter
            header: 'Şu değere sahip öğeleri göster:',
            and: 'Ve',
            or: 'Veya',
            stringOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 },
                { name: 'İle başlayan', op: 6 },
                { name: 'Son harfi', op: 7 },
                { name: 'İçerir', op: 8 },
                { name: 'İçermez', op: 9 }
            ],
            numberOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 },
                { name: 'Büyüktür', op: 2 },
                { name: 'Büyük veya eşittir', op: 3 },
                { name: 'Küçüktür', op: 4 },
                { name: 'Küçük veya eşittir', op: 5 }
            ],
            dateOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Öncesinde', op: 4 },
                { name: 'Sonrasında', op: 3 }
            ],
            booleanOperators: [
                { name: '(ayarlanmamış)', op: null },
                { name: 'Eşittir', op: 0 },
                { name: 'Eşit değildir', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.tr.js.map

