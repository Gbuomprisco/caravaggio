import { Result } from './types';
import { browser } from 'protractor';

export const name = 'Caravaggio';

/**
 * - set options
 * @name onPrepare
 * 
 * @export
 */
export function onPrepare() {
    const caravaggio = browser.params.caravaggio;
    caravaggio.setOptions(this.config);
};

/**
 * - evaluate results
 * @name postTest
 * 
 * @export
 * @param {any} passed
 * @param {any} testInfo
 */
export function postTest(passed, testInfo) {
    const caravaggio = browser.params.caravaggio;
    const results = caravaggio.getResults();

    if (!results.length) {
        return;
    }

    // clear results array
    caravaggio.clear();

    console.info(`${testInfo.category}: ${testInfo.name}`);

    // loop over results and report to protractor
    results.forEach(reportToProtractor.bind(this));
};

/**
 * @name reportToProtractor
 * @param {Result} result
 */
function reportToProtractor(result: Result) {
    const caravaggio = browser.params.caravaggio;

    if (result.hasPassed) {
        this.addSuccess(result.name, {differences: result.differences});
        
        // callback
        caravaggio.options.onSuccess(result);

        return;
    } 

    console.info(
        `${result.name} has differences with its standard image.
        If you believe the current state of ${name} to be the better one, 
        delete the image in the "standard" folder and rerun the tests`
    );

    this.addFailure(result.name, {differences: result.differences});

    // callback
    caravaggio.options.onFailure(result);
}

/**
 * @name teardown
 */
export function teardown() {
    const caravaggio = browser.params.caravaggio;
    caravaggio.options.onComplete();
}

export * from './caravaggio';

