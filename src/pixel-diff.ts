const PixelDiff = require('pixel-diff');
import { Result, ImageComparisonOptions } from './types';

/**
 * @name compareImages
 * @param {ImageComparisonOptions} options
 */
export function imageComparisonFn(options: ImageComparisonOptions): Promise<Result> {
    const threshold = options.tolerance === 0 ? 0 : options.tolerance / 100;

    const pixelDiff = new PixelDiff({
        imageAPath: options.standardPath,
        imageBPath: options.actualPath,
        thresholdType: PixelDiff.THRESHOLD_PERCENT,
        threshold,
        imageOutputPath: options.diffPath
    });

    return new Promise(resolve => {
        pixelDiff.runWithPromise().then(comparison => {
            resolve({
                hasPassed: pixelDiff.hasPassed(comparison.code),
                differences: comparison.differences,
                name: options.fileName
            });
        }).catch(console.error);
    });
}
