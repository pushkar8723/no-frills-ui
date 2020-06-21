# No Frills UI

[![npm version](https://badge.fury.io/js/no-frills-ui.svg)](https://badge.fury.io/js/no-frills-ui)
![Minifized Size](https://badgen.net/bundlephobia/min/no-frills-ui)
![Gzipped Size](https://badgen.net/bundlephobia/minzip/no-frills-ui)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

**React components that are made of styled native components. Mostly! 😅**

**Storybook / Documentation:** [https://no-frills-ui.netlify.app/](https://no-frills-ui.netlify.app/)

Modern-day  component libraries make components out of divs with custom styles and abstractions for events.
Often their focus is on touch-screen devices and so their event handlers are more focused on handling touch events.
This means when we use these libraries, we often ship a lot of code for styles and touch event handlers. Most of
which are available in native components out of the box. No Frills UI does not have these decorations, instead it
relies on the native components' APIs.

This helps in keeping our DOM much more cleaner as it is not a [div soup](https://www.hackterms.com/div%20soup) anymore.
It also improves the semantic of the document and making it more SEO friendly. This also means that we are not adding extra
code to support accessibility which comes out of the box with the platform itself.

Thus simplifying the API for the component. Now the developer doesn't need to go through a huge doc to know how to use
the component, instead, he/she can directly use the native element's props. However, this is also not always possible, as we
might want additional functionality on top of our native component. For which I will have to wrap it in divs and the native
API won't be directly accessible. To solve this, I use prop spreading on each component and only add props for these
extra features.

### Limitations

An obvious limitation of this approach is that certain components cannot be styled, like `<Option>` tag. Though we can
style it to some degree, the user experience will still differ based on the platform the user is on.

### Should this be used in production?

Well, this is the Achilles heel of this project. Currently, it is not production-ready. Nor it is battle-tested on any big
project. I created this repository mostly after realizing that at the start of each project, I juggle a lot between
different UI libraries and then settle to using `@emotion/styled` for half of the components. This is tailored to my needs
and I may not even have time to work on it regularly. But you can freely use this in any POCs that you might be working on
and then decide whether it fits your needs.

[MIT License](https://github.com/pushkar8723/no-frills-ui/blob/master/LICENSE)
