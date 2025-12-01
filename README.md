# No Frills UI

[![npm version](https://badge.fury.io/js/no-frills-ui.svg)](https://badge.fury.io/js/no-frills-ui)
[![Minified Size](https://badgen.net/bundlephobia/min/no-frills-ui)](https://bundlephobia.com/result?p=no-frills-ui)
[![Gzipped Size](https://badgen.net/bundlephobia/minzip/no-frills-ui)](https://bundlephobia.com/result?p=no-frills-ui)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

**React components that are made of styled native components. Mostly! 😅**

**Storybook / Documentation:** [https://no-frills-ui.netlify.app/](https://no-frills-ui.netlify.app/)

Most modern UI component libraries come as complete ecosystems—multiple npm packages,
custom design systems, proprietary APIs, and extensive documentation to learn. 
They rebuild everything from scratch using divs and spans, adding layers of abstraction 
for events, accessibility, and styling. While this gives them complete control, it also 
means shipping hundreds of kilobytes of JavaScript to recreate what browsers already provide.

No Frills UI takes a different approach: **use what the browser already gives you**. 
Instead of div soup with custom event handlers and accessibility bolt-ons, we build components 
from actual `<button>`, `<input>`, `<select>`, and `<dialog>` elements. This means you get 
native keyboard navigation, form behavior, and accessibility features out of the box—no extra code needed.

## Why No Frills UI?

**Smaller bundles, cleaner DOM:** Our components are styled with Emotion, but the underlying 
structure is real HTML. No div soup, no bloated abstractions. You're looking at kilobytes, 
not hundreds of kilobytes.

**Native APIs you already know:** Instead of learning proprietary component APIs across multiple 
npm packages, you can use standard HTML props and browser features. A button is a button. An input 
is an input. If you know HTML, you already know 90% of the API.

**Better semantics by default:** Real HTML elements mean better SEO, better accessibility baseline, 
and a DOM that actually makes sense when you inspect it. Your screen reader users (and your future 
self debugging in DevTools) will thank you.

**Simple theming:** Everything's themed through CSS variables. No complex theme providers, no 
JavaScript runtime overhead. Just set your colors at the root and you're done.

**Fast to get started:** No boilerplate, no configuration, no learning curve. Import a component 
and use it. Perfect for POCs, hackathons, and small projects.

## What's the Catch?

Let's be real about what this library is and isn't:

**This is a learning project, not a production library.** I built No Frills UI to experiment with 
native-first component design and to sharpen my React/TypeScript skills. It's grown into a proper component 
library with 20+ components, automated releases, and comprehensive Storybook documentation, but I work on 
this in my spare time for learning—not as a production-grade library.

## When Should You Use This?

**Perfect for:**
- Quick POCs and prototypes where you need UI fast
- Hackathon projects and weekend hacks
- Small personal projects and experiments
- Learning how to build React component libraries
- Bootstrapping an idea before investing in a full UI system

**Not suitable for:**
- Production applications
- Enterprise projects requiring support
- Projects with strict accessibility requirements (right now)
- Teams that need stable, battle-tested components
- Anything your business depends on

If you need production-ready components, use established libraries with active maintenance and community support. 
But if you're hacking on a side project, need components for a quick demo, or want to explore a simpler approach 
to React UIs, give No Frills UI a try!

And hey, if you're also learning and want to contribute to the roadmap in 
[issue #19](https://github.com/pushkar8723/no-frills-ui/issues/19), pull requests 
are welcome. We're all learning here! 🚀
