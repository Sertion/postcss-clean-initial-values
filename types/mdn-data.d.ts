/**
 * This is not a full represenation of the mdn-data module
 */
declare module 'mdn-data' {
    interface CSSData {
        properties: {
            [propertyName: string]: CSSProperty;
        };
    }

    interface CSSProperty {
        syntax: string;
        initial: string | string[];
        computed: string | string[];
    }

    export const css: CSSData;
}
