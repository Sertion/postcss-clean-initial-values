import { Declaration, Result } from 'postcss';

import { PossibleDeclaration, DeclarationWithMemoryOfShorthand, ANY_VALUE } from './find-duplicates';

export function possibleShorthand(
    declarations: PossibleDeclaration[],
    warnedDeclarations: Declaration[],
    result: Result,
    disableShorthandWarning?: boolean,
): declarations is Declaration[] {
    const shorthandPresent = declarations.filter(
        (declaration): declaration is DeclarationWithMemoryOfShorthand => declaration.value === ANY_VALUE,
    );

    if (shorthandPresent.length > 0) {
        // Early return if there is a shorthand present, you never know what those can do
        const isWarned = warnedDeclarations.includes(shorthandPresent[0].originalDeclaration);
        if (!disableShorthandWarning && !isWarned) {
            warnedDeclarations.push(shorthandPresent[0].originalDeclaration);
            result.warn(
                `Unable to clean out initial values when shorthand properties are present`,
                {
                    node: shorthandPresent[0].originalDeclaration,
                },
            );
        }
        return false;
    }

    return true;
}
