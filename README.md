# PostCSS Clean Initial Values [![Build Status][ci-img]][ci]

[PostCSS] plugin for removing properties setting the initial value.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.com/Sertion/postcss-clean-initial-values.svg
[ci]:      https://travis-ci.com/Sertion/postcss-clean-initial-values

```css
.foo {
    background-color: orange;
    background-color: transparent;
}
```

```css
.foo {
}
```

## Usage

```js
postcss([ require('postcss-clean-initial-values') ])
```

See [PostCSS] docs for examples for your environment.

## Options

### `matchSelector`
> Default: `/.*/`

A regular expression that matches all selectors to clean.

### `keepLoneRule`
> Default: See [keep-lone-defaults.ts](src/keep-lone-defaults.ts)

An array of strings with properties to keep even if they have their initial value.

### `disableShorthandWarning`
> Default: false

If the shorthand warnings get in your way you can disable them using this option.
