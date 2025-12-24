/*
 * MIT License
 *
 * Copyright (c) 2023 Massimo Candela <https://massimocandela.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import moment from "moment";
import CRC32 from "crc-32";

const _getFingerprint = (object, algorithm) => {

    switch (typeof (object)) {
        case "object":
            if (object == null) {
                return "o:null";
            } else if (object._isAMomentObject) {
                return `m:${object.toISOString()}`;
            } else if (object instanceof Date) {
                return `m:${moment(object).toISOString()}`;
            } else if (Array.isArray(object)) {
                return `a:[${object.map(i => getObjectFingerprint(i, algorithm))}]`;
            } else {
                return `o:${getObjectFingerprint(object, algorithm)}`;
            }
        case "boolean":
            return `b:${object ? "t" : "f"}`;
        case "function":
            return `f:${CRC32.str(object.toString(16))}`;
        case "number":
            return `n:${object.toString()}`;
        case "string":
            return `s:${object}`;
        case "undefined":
            return `u`;
    }
};

const getObjectFingerprint = (value, algorithm) => {
    try {
        if (typeof (value) === "object") {
            const sortedKeys = Object.keys(value).sort();
            let buff = "";

            for (let key of sortedKeys) {
                try {
                    buff += `${key}<${index(value[key], algorithm)}>`;
                } catch (error) {
                    buff += `${key}<nn>`;
                }
            }

            return buff;
        } else {
            return JSON.parse(value);
        }
    } catch (e) {
        return "nn";
    }
};

export default function index(object, algorithm) {
    if (algorithm) {
        return algorithm(_getFingerprint(object, algorithm));
    } else {
        return CRC32.str(_getFingerprint(object)).toString(16);
    }
}
