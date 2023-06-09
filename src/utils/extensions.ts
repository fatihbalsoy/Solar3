/*
 *   extensions.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/4/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */



export type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

const defaultCompare = (a: any, b: any): number => {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }
    return 0;
};

declare global {
    interface Array<T> {
        binaryInsert(item: T, compare?: (a: T, b: T) => number): void;
        binarySearch(value: T, compare?: (a: T, b: T) => number): number;
        binarySearchPrefix(searchTerm: T, compare?: (a: T, b: T) => number): number;
    }
}

if (!Array.prototype.binaryInsert) {
    Array.prototype.binaryInsert = function <T>(this: T[], item: T, compare?: (a: T, b: T) => number) {
        compare = compare || defaultCompare;
        let left = 0;
        let right = this.length - 1;
        let mid;

        while (left <= right) {
            mid = Math.floor((left + right) / 2);

            if (compare(item, this[mid]) < 0) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        this.splice(left, 0, item);
    };
}

if (!Array.prototype.binarySearch) {
    Array.prototype.binarySearch = function <T>(value: T, compare?: (a: T, b: T) => number): number {
        compare = compare || defaultCompare;
        let left = 0;
        let right = this.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const cmp = compare(value, this[mid]);

            if (cmp > 0) {
                left = mid + 1;
            } else if (cmp < 0) {
                right = mid - 1;
            } else {
                return mid;
            }
        }

        return -1;
    };
}

if (!Array.prototype.binarySearchPrefix) {
    Array.prototype.binarySearchPrefix = function <T>(searchTerm: T, compare?: (a: T, b: T) => number): number {
        compare = compare || defaultCompare;
        let left = 0;
        let right = this.length - 1;
        let prefix: T[] = [];

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = compare(this[mid], searchTerm);

            if (comparison < 0) {
                left = mid + 1;
            } else if (comparison > 0) {
                right = mid - 1;
            } else {
                let prefixStartIndex = mid;
                while (prefixStartIndex >= 0 && compare(this[prefixStartIndex], searchTerm) === 0) {
                    prefixStartIndex--;
                }
                prefixStartIndex++;

                let prefixEndIndex = mid;
                while (prefixEndIndex < this.length && compare(this[prefixEndIndex], searchTerm) === 0) {
                    prefixEndIndex++;
                }
                prefixEndIndex--;

                prefix = this.slice(prefixStartIndex, prefixEndIndex + 1);
                return mid
            }
        }

        return left
    }
}