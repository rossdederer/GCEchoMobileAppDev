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
 * Wijmo culture file: ar-AE (Arabic (U.A.E.))
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'د.إ.‏', pattern: ['$n-', '$ n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 6,
                days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                daysAbbr: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليه', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                monthsAbbr: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليه', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                am: ['ص', 'ص'],
                pm: ['م', 'م'],
                eras: ['م'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dd MMMM, yyyy',
                    f: 'dd MMMM, yyyy hh:mm tt', F: 'dd MMMM, yyyy hh:mm:ss tt',
                    t: 'hh:mm tt', T: 'hh:mm:ss tt',
                    m: 'dd MMMM', M: 'dd MMMM', 
                    y: 'MMMM, yyyy', Y: 'MMMM, yyyy', 
                    g: 'dd/MM/yyyy hh:mm tt', G: 'dd/MM/yyyy hh:mm:ss tt',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: 'العناصر المحددة  {count:n0}'
        },
        FlexGrid: {
            groupHeaderFormat: '(العناصر {count:n0})<b> {value}</b> :{name}'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 تصاعديًا',
            descending: '\u2193 تنازليًا',
            apply: 'تطبيق',
            clear: 'مسح',
            conditions: 'تصنيف حسب الحالة',
            values: 'تصنيف حسب القيمة',

            // value filter
            search: 'بحث',
            selectAll: 'تحديد الكل',
            null: '(لا شيء)',

            // condition filter
            header: 'عرض العناصر حيث توجد القيمة',
            and: 'و',
            or: 'أو',
            stringOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 },
                { name: 'يبدأ بـ', op: 6 },
                { name: 'ينتهي بـ', op: 7 },
                { name: 'يحتوي على', op: 8 },
                { name: 'لا يحتوى على', op: 9 }
            ],
            numberOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 },
                { name: 'أكبر من', op: 2 },
                { name: 'أكبر من أو يساوي', op: 3 },
                { name: 'أقل من', op: 4 },
                { name: 'أقل من أو يساوي', op: 5 }
            ],
            dateOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'قبل', op: 4 },
                { name: 'بعد', op: 3 }
            ],
            booleanOperators: [
                { name: '(لم يتم التعيين)', op: null },
                { name: 'تساوي', op: 0 },
                { name: 'لا تساوي', op: 1 }
            ]
        }
    };
};
