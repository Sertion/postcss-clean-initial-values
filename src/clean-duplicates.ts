import { Declaration, Result } from 'postcss';

import { DuplicateIndex } from './find-duplicates';
import { possibleShorthand } from './possible-shorthand';
import { getInitialValue } from './get-initial-value';
import { getDeclarationsForRemoval } from './get-declarations-for-removal';

export function cleanDuplicates(
    duplicates: DuplicateIndex,
    result: Result,
    keepLoneProperties: Set<string>,
    disableShorthandWarning?: boolean,
): void {
    const warnedDeclarations: Declaration[] = [];

    for (const [property, duplicated] of Object.entries(duplicates)) {
        if (!possibleShorthand(
            duplicated,
            warnedDeclarations,
            result,
            disableShorthandWarning,
        )) {
            continue;
        }

        const initialValue = getInitialValue(property);

        if (initialValue === false) {
            continue;
        }

        const removableDeclarations = getDeclarationsForRemoval(
            duplicated,
            initialValue,
            keepLoneProperties.has(property),
        );

        removableDeclarations.forEach((declaration): void => {
            declaration.remove();
        });
    }
}
