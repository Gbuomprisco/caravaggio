import * as console from 'console';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { protractor } from 'protractor';

const PixelDiff = require('pixel-diff');
const defaults: Options = {
    screenshotsPath: './screenshots',
    threshold: 0,
    // resolutions: [320, 768, 1024, 1366, 1440, 1920]
};

import { Options, Type, Result } from './types';

export default class Caravaggio {
    private results: Result[] = [];
    private options: Options;

    /**
     * @name setOptions
     *
     * @param {Options} options
     *
     * @memberOf Caravaggio
     */
    public setOptions(options: Options) {
        this.options = Object.assign({}, defaults, options);

        // generate folders based on the option passed
        this.createFolders();
    }

    /**
     *
     * @name getResults
     *
     * @memberOf Caravaggio
     */
    public getResults(): Result[] {
        return this.results;
    }

    /**
     *
     * @name capture
     * @param {string} fileName
     *
     * @memberOf Caravaggio
     */
    public async capture(fileName: string) {
        const screenshot = await protractor.browser.takeScreenshot();
        const standard = this.getImageUrl(fileName, 'standard');

        if (existsSync(standard) === false) {
            console.info(`${fileName} does not exist. It will be generated as standard image.`);
            this.createImage(fileName, screenshot, 'standard');
        }

        this.createImage(fileName, screenshot, 'actual');
        this.runComparison(fileName);
    }

    /**
     * @name clear
     *
     * @memberOf Caravaggio
     */
    public clear(): void {
        this.results = [];
    }

    /**
     * @name runComparison
     * @param {string} fileName
     *
     * @memberOf Caravaggio
     */
    private async runComparison(fileName: string): Promise<any> {
        const standard = this.getImageUrl(fileName, 'standard');
        const actual = this.getImageUrl(fileName, 'actual');
        const threshold = this.options.threshold === 0 ? 0 : this.options.threshold / 100;

        const pixelDiff = new PixelDiff({
            imageAPath: standard,
            imageBPath: actual,

            thresholdType: PixelDiff.THRESHOLD_PERCENT,
            threshold,

            imageOutputPath: this.getImageUrl(fileName, 'diff')
        });

        const diff = await pixelDiff.runWithPromise();

        this.addResult({
            hasPassed: pixelDiff.hasPassed(diff.code),
            differences: diff.differences,
            name: fileName
        });
    }

    /**
     * @name getImageUrl
     *
     * @private
     * @param {string} fileName
     * @param {('actual' | 'target' | 'diff')} type
     * @returns {string}
     *
     * @memberOf Caravaggio
     */
    private getImageUrl(fileName: string, type: Type): string {
        return `${this.options.screenshotsPath}/${type}/${fileName}.png`;
    }

    /**
     * @name createFolders
     *
     * @private
     *
     * @memberOf Caravaggio
     */
    private createFolders() {
        const folders = [
            `${this.options.screenshotsPath}/standard`,
            `${this.options.screenshotsPath}/actual`,
            `${this.options.screenshotsPath}/diff`
        ];

        folders.forEach(folder => {
            if (!existsSync(folder)) {
                mkdirSync(folder);
            }
        });
    }

    /**
     * @name createImage
     *
     * @private
     * @param {string} fileName
     * @param {any} data
     * @param {Type} type
     *
     * @memberOf Caravaggio
     */
    private createImage(fileName: string, data: any, type: Type): void {
        var actual = createWriteStream(this.getImageUrl(fileName, type), {flags: 'w'});
        actual.write(new Buffer(data, 'base64'));
        actual.end();
    }

    /**
     * @name addResult
     *
     * @private
     * @param {Result} result
     *
     * @memberOf Caravaggio
     */
    private addResult(result: Result) {
        this.results = [...this.results, result];
    }
}
