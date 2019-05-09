export function verifyKeepLoneRule(keepLoneRule: unknown): keepLoneRule is string[] | null {
    if (keepLoneRule === null) {
        return true;
    }

    if (
        Array.isArray(keepLoneRule)
        && keepLoneRule.every((rule): rule is string => typeof rule === 'string')
    ) {
        return true;
    }

    return false;
}

export function verifyMatchSelector(matchSelector: unknown): matchSelector is RegExp {
    return matchSelector instanceof RegExp;
}

export function verifyDisableShorthandWardning(disableShorthandWarning: unknown): disableShorthandWarning is boolean {
    return typeof disableShorthandWarning === 'boolean';
}
