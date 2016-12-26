const PixelDiff = require('pixel-diff');
import { Result } from './types';

/**
 * @name compareImages
 * @param {string} fileName
 */
export async function imageComparisonFn(fileName: string, tolerance: number): Promise<Result> {
    const standard = this.getImageUrl(fileName, 'standard');
    const actual = this.getImageUrl(fileName, 'actual');
    const threshold = tolerance === 0 ? 0 : tolerance / 100;

    const pixelDiff = new PixelDiff({
        imageAPath: standard,
        imageBPath: actual,
        thresholdType: PixelDiff.THRESHOLD_PERCENT,
        threshold,
        imageOutputPath: this.getImageUrl(fileName, 'diff')
    });

    const comparison = await pixelDiff.runWithPromise();

    return <Result>{
        hasPassed: pixelDiff.hasPassed(comparison.code),
        differences: comparison.differences,
        name: fileName
    };
}
