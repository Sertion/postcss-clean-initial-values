import { Rule, Declaration, DeclarationNewProps } from 'postcss';
import { css } from 'mdn-data';

export interface DeclarationWithMemoryOfShorthand extends DeclarationNewProps {
    originalDeclaration: Declaration;
}
export type PossibleDeclaration = Declaration | DeclarationWithMemoryOfShorthand;
export const ANY_VALUE = 'somevalue';

export interface DuplicateIndex {
    [property: string]: PossibleDeclaration[];
}

export function findDuplicates(rule: Rule): DuplicateIndex {
    const duplicates: DuplicateIndex = {};

    rule.walkDecls((declaration: Declaration): void => {
        if (!(declaration.prop in css.properties)) {
            return;
        }

        if (duplicates[declaration.prop] === undefined) {
            duplicates[declaration.prop] = [];
        }

        duplicates[declaration.prop].push(declaration);

        const cssPropertyProperties = css.properties[declaration.prop];

        if (typeof cssPropertyProperties.computed === 'string') {
            return;
        }

        for (const childProperty of cssPropertyProperties.computed) {
            if (duplicates[childProperty] === undefined) {
                duplicates[childProperty] = [];
            }

            duplicates[childProperty].push({
                prop: childProperty,
                value: ANY_VALUE,
                originalDeclaration: declaration,
            });
        }
    });

    return duplicates;
}
