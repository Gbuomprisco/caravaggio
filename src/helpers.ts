import { browser } from 'protractor/built';
import { protractor, $ } from 'protractor';
import { Options } from './types';
import { imageComparisonFn } from './pixel-diff';

const lwip = require('lwip');
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

    protractor.promise.all([location, size, screenshot]).then(data => {
        cropImage(data, (buffer) => {
            const image = Buffer.from(buffer, 'base64');
            deferred.fulfill(image);
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

export function cropImage(data: any[], callback) {
    const buffer = new Buffer(data[2], 'base64');

    const OFFSET = 30;
    const extent = (n: number): number => n + (OFFSET * 2);
    const position = (n: number): number => n - OFFSET >= 0 ? n - OFFSET : n;

    const left = position(data[0].x);
    const top = position(data[0].y);
    const width = extent(left + data[1].width);
    const height = extent(top + data[1].height);

    return lwip.open(buffer, 'png', (err, image) => {
        image.batch()
            .crop(left, top, width, height)
            .toBuffer('png', (error, bufferedImage) => callback(bufferedImage));
    });
}
