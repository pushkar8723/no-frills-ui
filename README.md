# No Frills UI

**React components that are made of styled native components. Mostly! 😅**

This means that our DOM is much more cleaner and is not a [div soup](https://www.hackterms.com/div%20soup). Improving
the semantic of the document and making it more SEO friendly. It also means that we are not adding extra code to support
accessibility which comes out of the box with the platform itself.

This also simplifies the API for the component as the developer now doesn't need to go to a huge doc to know how to use
the component, instead it can directly use the native element's props. However, this is also not always possible, as we
might want additional functionality on top of the native component. To solve this, I use prop spreading on each component
and only added the props for these extra features.

### Limitations

An obvious limitation of this approach is that certain components cannot be styled, like `<Option>` tag. Though we can
style it to some degree, the user experience will still differ based on the platform the user is on.

### Should this be used in production?

Well, this is the Achilles heel of this project. Currently, it is not production-ready. Nor it is battle-tested on any big
project. I created this repository mostly after realizing that at the start of each project I juggle a lot between
different UI libraries and then using `styled-components` for half of the components. This is tailored to my needs and
I may not even have time to work on it regularly. But you can freely use this in any POCs that you might be doing.