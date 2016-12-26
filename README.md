# Caravaggio

Caravaggio is a simple visual regression testing plugin for Protractor. 

## Install
        
    npm install caravaggio-protractor --save-dev

## Quick Start

### Add Caravaggio to the Protractor's configuration

```javascript
// protractor.conf

// if you use typescript
import { Caravaggio } from 'caravaggio-protractor';

// or if you use node
const Caravaggio = require('caravaggio-protractor');

exports.config = {
    // add caravaggio to the plugins array and define its options
    plugins: [{
        package: 'caravaggio-protractor',
        screenshotsPath: '/path/to/my/screenshots', // please create the 'screenshots' folder if missing
    }],

    // add caravaggio to the params object
    params: {
        caravaggio: new Caravaggio()
    },

    // rest of the Protractor's configuration
};
```

### Take screenshots in your tests using Caravaggio
We need to retrieve Caravaggio using the Protractor's browser parameters, which we defined in the config.
In order to create a comparison, you can use `caravaggio.capture(name)` - and a new screenshot will be generated using the name provided.


```javascript
import { browser } from 'protractor';
const caravaggio = browser.params.caravaggio;

it('does something I expect in page "about"', () => {
    caravaggio.capture('about');

    clickOnButton().then(() => {
        // target full page
        caravaggio.capture('about-button-clicked');
        
        // target a specific selector
        caravaggio.capture('about-button-clicked--header', '.header');
    });
});

```
Every time a screenshot is taken for the first time, Caravaggio adds it as a baseline image.

If you think that a change in your application needs to be the new standard instead, just delete the file in the folder `screenshotsPath/standard`.    

Caravaggio fully integrates with Protractor: failures will be added to the reports at the end of the tests, and so will successful tests.

## API
Plugin configuration

```javascript
{
    package: 'caravaggio-protractor',        // name of the package (mandatory)
    screenshotsPath: '/path/to/screenshots', // path to screenshots folder (default './screenshots')
    tolerance: 0,                            // mismatch tolerance expressed in percentage (default 0)

    onFailure: (Result) => any,              // callback when a test fails
    onSuccess: (Result) => any,          // callback when a test passes
    onComplete: () => any,                   // callback all tests complete
    onNewImage: (fileName: string) => any,   // callback when a baseline image is created

    // image comparison function, you can overwrite it and use your own (or using a different library)
    // as long as it returns a Result (see interface below)
    imageComparisonFn: (fileName: string, tolerance: number) => Result
}
```

`Result` interface:

```javascript
interface Result {
    hasPassed: boolean;
    differences: number;
    name: string;
}
```

### Add screenshots folder to your .gitignore

Add `${screenshotsPath}/actual` and `${screenshotsPath}/diff` as you do not want to have these images in your repository.

### Image comparison

The default comparison between screenshots is based on the library [PixelDiff](https://github.com/koola/pixel-diff), but you can write your own if you prefer.

### Support for other frameworks

Support for more frameworks may follow. I am planning to decouple Caravaggio from Protractor.