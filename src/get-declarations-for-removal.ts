import { Declaration } from "postcss";

export function getDeclarationsForRemoval(
    declarations: Declaration[],
    initialValue: string,
    keepIfAlone: boolean,
): Declaration[] {
    const initialValueReversedDeclarationIndex = [...declarations]
        .reverse()
        .findIndex(
            (decl): boolean => {
                if (decl.value === initialValue || decl.value === 'initial') {
                    return true;
                }

                if (decl.value.match(/!keep$/)) {
                    return true;
                }

                return false;
            }
        );

    if (initialValueReversedDeclarationIndex === -1) {
        // Early return if there are no initial values and no !keep
        return [];
    }

    let removedUntilIndex = declarations.length - initialValueReversedDeclarationIndex;

    if (keepIfAlone) {
        removedUntilIndex = removedUntilIndex - 1;
    }

    const removeableDeclarations = declarations.slice(0, removedUntilIndex);

    const removeableDeclarationsWithoutBangKeep = removeableDeclarations
        .map((declaration): Declaration | undefined => {
            if (declaration.value.match(/!keep$/)) {
                declaration.value = declaration.value.replace(/\s*!keep$/, '');
                return undefined;
            }

            return declaration;
        })
        .filter((a): a is Declaration => !!a);

    return removeableDeclarationsWithoutBangKeep;
}
