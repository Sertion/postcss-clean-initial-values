import { css } from 'mdn-data';

export function getInitialValue(property: string): string | false {
    const initialValueRaw = css.properties[property].initial;

    if (Array.isArray(initialValueRaw)) {
        // Early return if the initial value is an array
        return false;
    }

    return initialValueRaw.trim();
}
