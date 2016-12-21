import { browser } from 'protractor';

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

    console.info(`${testInfo.category}: ${testInfo.name}`);

    results.forEach(reportToProtractor.bind(this));
    caravaggio.clear();
};

function reportToProtractor(result) {
    if (result.hasPassed) {
        this.addSuccess(result.name, {differences: result.differences});
        return;
    } 

    console.info(
        `${result.name} has differences with its standard image.
        If you believe the current state of ${name} to be the best, 
        delete the image in the "standard" folder and rerun the tests`
    );

    this.addFailure(result.name, {differences: result.differences});
}

export const name = 'Caravaggio';
export * from './caravaggio';

