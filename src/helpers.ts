import { browser } from 'protractor/built';
import { protractor, element, by, $ } from 'protractor';
import { Options } from './types';
import { imageComparisonFn } from './pixel-diff';

const sharp = require('sharp');
const noop = (...args) => {};

export const defaults: Options = {
    screenshotsPath: './screenshots',
    tolerance: 0,
    debug: false,
    isEnabled: true,

    // callbacks
    onFailure: noop,
    onSuccess: noop,
    onComplete: noop,
    onNewImage: noop,
    // resolutions: [320, 768, 1024, 1366, 1440, 1920],

    imageComparisonFn
};

/**
 * @name getFolders
 */
export function getFolders(screenshotsPath: string): string[] {
    return [
        `${screenshotsPath}/standard`,
        `${screenshotsPath}/actual`,
        `${screenshotsPath}/diff`
    ];
}

/**
 * @param {string} selector
 * @name takeScreenshot
*/
export function takeScreenshot(selector: string) {
    const screenshot = protractor.browser.takeScreenshot();

    if (!selector) {
        return screenshot;
    }

    const el = $(selector);
    const size = el.getSize();
    const location = el.getLocation();
    const deferred = protractor.promise.defer();
    const OFFSET = 20;

    protractor.promise.all([location, size, screenshot]).then(data => {
        sharp(new Buffer(data[2], 'base64'))
            .extract({
                width: data[1].width + (OFFSET * 2),
                height: data[1].height + (OFFSET * 2),
                left: data[0].x - OFFSET,
                top: data[0].y - OFFSET
            })
            .toBuffer()
            .then(image => {
                deferred.fulfill(Buffer.from(image, 'base64'));
            });
    });

    return deferred.promise;
}

/**
 * @name getSize
 */
export function getSize() {
    return browser.driver.manage().window().getSize();
}

/**
 * @name log
 */
export function log(text: string, color: string = '\x1b[34m'): void {
    console.log(color, text, '\x1b[0m');
}
