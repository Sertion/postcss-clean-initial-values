import postcss from 'postcss';

import plugin from  './index';
import { Options } from 'interface-options';

async function runWithWarning(
    input: string,
    output: string,
    warningCount: number = 0,
    opts?: Options,
): Promise<void> {
    const result = await postcss(plugin(opts)).process(input, { from: undefined });

    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(warningCount);
}

async function run(
    input: string,
    output: string,
    opts?: Options,
): Promise<void> {
    await runWithWarning(input, output, 0, opts);
}

describe('Base functionality', (): void => {
    test('Remove properties with initial value', async (): Promise<void> => {
        await run(
            `.a {
                background-color: transparent;
            }`,
            `.a {
            }`,
        );
    });

    test('Remove properties with initial as value', async (): Promise<void> => {
        await run(
            `.a {
                background-color: initial;
            }`,
            `.a {
            }`,
        );
    });

    test('Keep properties without initial value', async (): Promise<void> => {
        await run(
            `.a {
                background-color: red;
            }`,
            `.a {
                background-color: red;
            }`,
        );
    });

    test('Remove properties that occur multiple times with initial value as the last value', async (): Promise<void> => {
        await run(
            `.a {
                background-color: lightgoldenrodyellow;
                background-color: transparent;
            }`,
            `.a {
            }`,
        );
    });

    test('Keep all properties that occur multiple times without initial value', async (): Promise<void> => {
        await run(
            `.a {
                background-color: lightgoldenrodyellow;
                background-color: red;
            }`,
            `.a {
                background-color: lightgoldenrodyellow;
                background-color: red;
            }`,
        );
    });

    test('Clean all values before the last initial value in a list of several properties', async (): Promise<void> => {
        await run(
            `.a {
                background-color: lightgoldenrodyellow;
                background-color: transparent;
                background-color: green;
                background-color: rgba(0, 200, 150, 0.3);
                background-color: transparent;
                background-color: red;
            }`,
            `.a {
                background-color: red;
            }`,
        );
    });

    test('Clean all values of different properties no matter the order', async (): Promise<void> => {
        await run(
            `.a {
                background-color: green;
                transform: rotate(-20deg);
                background-color: transparent;
                transform: none;
                background-color: red;
                transform: rotate(10deg);
            }`,
            `.a {
                background-color: red;
                transform: rotate(10deg);
            }`
        );
    });

    test('Multiple rules', async (): Promise<void> => {
        await run(
            `.a {
                background-color: orange;
                background-color: transparent;
            }
            .b {
                transform: rotate(10deg);
                transform: none;
            }`,
            `.a {
            }
            .b {
            }`,
        );
    });

    test('Unknown parameter', async (): Promise<void> => {
        await run(
            `.a {
                not-real-parameter: it-is-unknown;
            }`,
            `.a {
                not-real-parameter: it-is-unknown;
            }`,
        );
    });
});

describe('CSS shorthands', (): void => {
    test('keep values and warn about it', async (): Promise<void> => {
        await runWithWarning(
            `.a {
                background: #ff0022 linear-agradient(red, blue);
                background-color: transparent;
            }`,
            `.a {
                background: #ff0022 linear-agradient(red, blue);
                background-color: transparent;
            }`,
            1,
        );
    });

    test('keep values even if shorthand is last', async (): Promise<void> => {
        await runWithWarning(
            `.a {
                background-color: transparent;
                background: #ff0022 linear-agradient(red, blue);
            }`,
            `.a {
                background-color: transparent;
                background: #ff0022 linear-agradient(red, blue);
            }`,
            1,
        );
    });

    test('keep all values if shorthand is present', async (): Promise<void> => {
        await runWithWarning(
            `.a {
                background: #ff0022 linear-gradient(red, blue);
                background-color: lightgoldenrodyellow;
                background-color: transparent;
                background-color: red;
            }`,
            `.a {
                background: #ff0022 linear-gradient(red, blue);
                background-color: lightgoldenrodyellow;
                background-color: transparent;
                background-color: red;
            }`,
            1
        );
    });
});

describe('keepLoneRule', (): void => {
    test('do not remove initial value for listed properties', async (): Promise<void> => {
        await run(
            `.a {
                font-size: 20px;
                background-color: transparent;
            }`,
            `.a {
                font-size: 20px;
                background-color: transparent;
            }`,
            {
                keepLoneRule: ['background-color']
            }
        );
    });

    test('clear out overriden properties', async (): Promise<void> => {
        await run(
            `.a {
                background-color: red;
                background-color: transparent;
            }`,
            `.a {
                background-color: transparent;
            }`,
            {
                keepLoneRule: ['background-color']
            }
        );
    });
});

describe('!keep', (): void => {
    test('one property', async (): Promise<void> => {
        await run(
            `.a {
                background-color: transparent !keep;
            }`,
            `.a {
                background-color: transparent;
            }`,
        );
    });

    test('multiple properties', async (): Promise<void> => {
        await run(
            `.a {
                background-color: firebrick !keep;
                background-color: red;
                background-color: transparent !keep
            }`,
            `.a {
                background-color: firebrick;
                background-color: transparent
            }`,
        );
    });

    test('multiple properties and not last', async (): Promise<void> => {
        await run(
            `.a {
                background-color: firebrick !keep;
                background-color: red;
                background-color: transparent !keep;
                background-color: lightgoldenrodyellow;
            }`,
            `.a {
                background-color: firebrick;
                background-color: transparent;
                background-color: lightgoldenrodyellow;
            }`,
        );
    });

    test('multiple !keep', async (): Promise<void> => {
        await run(
            `.a {
                background-color: firebrick !keep !keep;
            }`,
            `.a {
                background-color: firebrick !keep;
            }`,
        );
    });

    test('together with !important - after', async (): Promise<void> => {
        await run(
            `.a {
                background-color: firebrick !important !keep;
            }`,
            `.a {
                background-color: firebrick !important;
            }`,
        );
    });

    test('together with !important - before', async (): Promise<void> => {
        await run(
            `.a {
                background-color: firebrick !keep !important;
            }`,
            `.a {
                background-color: firebrick !important;
            }`,
        );
    });
});

describe('Invalid options', (): void => {
    /**
     * These test will use the "x as unknown as y" pattern in order
     * to be able to test how the application deals with incorrect
     * parameters.
     */
    test('matchSelector is a string', (): void => {
        const resultFunction = (): void => {
            plugin({
                matchSelector: ".a",
            } as unknown as Options);
        };

        expect(resultFunction).toThrowError();
    });

    test('keepLoneRule is a string', (): void => {
        const resultFunction = (): void => {
            plugin({
                keepLoneRule: "a-string",
            } as unknown as Options);
        };

        expect(resultFunction).toThrowError();
    });

    test('disableShorthandWarning is a string', (): void => {
        const resultFunction = (): void => {
            plugin({
                disableShorthandWarning: "a-string",
            } as unknown as Options);
        };

        expect(resultFunction).toThrowError();
    });
});
