# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.1 -- Update dependencies

Updating a lot of dependencies as well as adding an engine field to the package.json.

## 2.0.0 -- PostCSS 8 support

Updated to work with PostCSS 8.

## 1.0.0 -- Initial Release

Take a list of multiple properties and clear out all repeated properties above the last [initial value](https://developer.mozilla.org/en-US/docs/Web/CSS/initial_value). This might be useful when using an extension that combines rules with the same selector and the last declaration tries to remove the default value by setting the value to its [initial value](https://developer.mozilla.org/en-US/docs/Web/CSS/initial_value).

At this time it will not clean any properties related to a [shorthand property](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) in the same rule. It is possible to use [a plugin](https://www.npmjs.com/package/postcss-shorthand-expand) to expand the shorthand property and then use [cssnano](https://cssnano.co/optimisations/mergelonghand) to merge them.
