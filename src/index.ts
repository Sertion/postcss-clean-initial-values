import { plugin, Root, Result, Rule } from 'postcss';

import { Options } from './interface-options';
import {
    verifyDisableShorthandWardning,
    verifyKeepLoneRule,
    verifyMatchSelector,
} from './verify-options';
import { findDuplicates } from './find-duplicates';
import { cleanDuplicates } from './clean-duplicates';
import keepLoneDefaults from './keep-lone-defaults';

type Unknownify<T> = {
    [P in keyof T]: unknown;
};

export default plugin(
    'postcss-clean-initial-values',
    (
        {
            matchSelector = /.+/,
            keepLoneRule = null,
            disableShorthandWarning = false,
        }: Unknownify<Options> = {},
    ): (
        root: Root,
        result: Result,
        ) => Promise<void> => {

        let keepLoneProperties: Set<string>;

        if (!verifyMatchSelector(matchSelector)) {
            throw new Error('[postcss-clean-initial-values] matchSelector must be a regular expression');
        }

        if (!verifyKeepLoneRule(keepLoneRule)) {
            throw new Error('[postcss-clean-initial-values] keepLoneRule must be an array of strings');
        }

        if (!verifyDisableShorthandWardning(disableShorthandWarning)) {
            throw new Error('[postcss-clean-initial-values] disableShorthandWarning must be a boolean');
        }

        if (keepLoneRule === null) {
            keepLoneProperties = new Set(keepLoneDefaults);
        } else {
            keepLoneProperties = new Set(keepLoneRule);
        }

        return async (
            root: Root,
            result: Result,
        ): Promise<void> => {
            root.walkRules(matchSelector, (rule: Rule): void => {
                const duplicates = findDuplicates(rule);

                cleanDuplicates(
                    duplicates,
                    result,
                    keepLoneProperties,
                    disableShorthandWarning,
                );
            });
        };
    },
);
