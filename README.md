# Caravaggio 4 Protractor

Caravaggio is a dead simple visual regression testing plugin for taking and comparing screenshots with Protractor.

**Plugin is in early stage development**

## Install
        
    npm install caravaggio-protractor --save-dev

## Usage

### Add Caravaggio to the protractor configuration

```javascript
// protractor.conf

// if you use typescript
import Caravaggio from 'caravaggio-protractor';

/* or if you use node */
const Caravaggio = require('caravaggio-protractor').default;

exports.config = {
    // add caravaggio to the plugins array and define its options
    plugins: [{
        package: 'caravaggio-protractor',
        screenshotsPath: '/path/to/my/screenshots', // please create the 'screenshots' folder if missing
        threshold: 0 // this is by default, no need to define it
    }],

    // add caravaggio to the params object
    params: {
        caravaggio: new Caravaggio()
    },

    // rest of the configuration
};
```

### Take screenshots in your tests using Caravaggio
We need to retrieve Caravaggio using the Protractor's browser parameters, which we defined in the config.
In order to create a comparison, we use `caravaggio.capture(name)` - and a new screenshot will be generated using the name provided.


```javascript
import { browser } from 'protractor';
const caravaggio = browser.params.caravaggio;

it('does something I expect in page "about"', () => {
    caravaggio.capture('about');

    clickOnButton().then(() => {
        caravaggio.capture('about-button-clicked');
    });
});

```
Every time a screenshot is taken for the first time, Caravaggio assumes it as a gold standard for the tests. If you wish to manually change it, you're free to do so.

If you think that a change in your application needs to be the new standard instead, just delete the file in the folder `screenshotsPath/standard`.    

Caravaggio fully integrates with Protractor: failures will be added to the reports at the end of the tests, and so will successful tests.

The comparison between screenshots is based on the library [PixelDiff](https://github.com/koola/pixel-diff)

### Add screenshots folder to your .gitignore

Add `${screenshotsPath}/actual` and `${screenshotsPath}/diff` as you do not want to have these images in your repository.