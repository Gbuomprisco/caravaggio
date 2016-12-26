import { protractor, element, by } from 'protractor';
import { Options } from './types';
import { imageComparisonFn } from './pixel-diff';

const noop = (...args) => {};

export const defaults: Options = {
    screenshotsPath: './screenshots',
    tolerance: 0,
    debug: false,

    // callbacks
    onFailure: noop,
    onSuccess: noop,
    onComplete: noop,
    onNewImage: noop,
    // resolutions: [320, 768, 1024, 1366, 1440, 1920],

    imageComparisonFn
};

/**
     * @param {string} selector
     * @name takeScreenshot
     */
export function takeScreenshot(selector: string) {
    return (selector ? element(by.css(selector)) : protractor.browser).takeScreenshot();
}