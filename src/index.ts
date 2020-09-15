import { Root, Result, Rule, Plugin, Helpers } from 'postcss';

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

module.exports = (
    {
        matchSelector = /.+/,
        keepLoneRule = null,
        disableShorthandWarning = false,
    }: Unknownify<Options> = {},
): Plugin => {

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

    return {
        postcssPlugin: 'postcss-clean-initial-values',
        Root(root: Root, { result }: Helpers): void {
            root.walkRules(matchSelector, (rule: Rule): void => {
                const duplicates = findDuplicates(rule);

                cleanDuplicates(
                    duplicates,
                    result,
                    keepLoneProperties,
                    disableShorthandWarning,
                );
            });
        }
    }
};

module.exports.postcss = true
