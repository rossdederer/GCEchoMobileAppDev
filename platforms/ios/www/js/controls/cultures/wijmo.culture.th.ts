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
 * Wijmo culture file: th (Thai)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': '.',
                ',': ',',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: '฿', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
                daysAbbr: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
                months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
                monthsAbbr: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                am: ['AM', 'A'],
                pm: ['PM', 'P'],
                eras: ['พ.ศ.'],
                patterns: {
                    d: 'd/M/yyyy', D: 'd MMMM yyyy',
                    f: 'd MMMM yyyy H:mm', F: 'd MMMM yyyy H:mm:ss',
                    t: 'H:mm', T: 'H:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'd/M/yyyy H:mm', G: 'd/M/yyyy H:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} รายการที่เลือก'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} รายการ)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 เรียงขึ้น',
            descending: '\u2193 เรียงลง',
            apply: 'ใช้',
            clear: 'ล้าง',
            conditions: 'กรองตามเงื่อนไข',
            values: 'กรองตามค่า',

            // value filter
            search: 'ค้นหา',
            selectAll: 'เลือกทั้งหมด',
            null: '(ไม่มี)',

            // condition filter
            header: 'แสดงรายการที่มีค่า',
            and: 'และ',
            or: 'หรือ',
            stringOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 },
                { name: 'ขึ้นต้นด้วย', op: 6 },
                { name: 'ลงท้ายด้วย', op: 7 },
                { name: 'มี', op: 8 },
                { name: 'ไม่มี', op: 9 }
            ],
            numberOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 },
                { name: 'มากกว่า', op: 2 },
                { name: 'มากกว่าหรือเท่ากับ', op: 3 },
                { name: 'น้อยกว่า', op: 4 },
                { name: 'น้อยกว่าหรือเท่ากับ', op: 5 }
            ],
            dateOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'มาก่อน', op: 4 },
                { name: 'มาหลัง', op: 3 }
            ],
            booleanOperators: [
                { name: '(ไม่ได้ตั้งค่า)', op: null },
                { name: 'เท่ากับ', op: 0 },
                { name: 'ไม่เท่ากับ', op: 1 }
            ]
        }
    };
};
