import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Options, Type, Result } from './types';
import { defaults, takeScreenshot } from './helpers';
import * as console from 'console';

export class Caravaggio {
    /**
     * @name results
     */
    private results: Result[] = [];

    /**
     * @name options
     */
    private options: Options;

    /**
     * @name setOptions
     *
     * @param {Options} options
     *
     * @memberOf Caravaggio
     */
    public setOptions(options: Options): void {
        this.options = {...defaults, ...options};

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
        return [...this.results];
    }

    /**
     *
     * @name capture
     * @param {string} fileName
     * @param {string} selector
     *
     * @memberOf Caravaggio
     */
    public async capture(fileName: string, selector?: string) {
        const screenshot = await takeScreenshot(selector);
        const standard = this.getImageUrl(fileName, 'standard');

        // if the standard image does not exit - create the baseline
        if (existsSync(standard) === false) {
            console.info(`${fileName} does not exist. It will be generated as standard image.`);
            
            this.createImage(fileName, screenshot, 'standard');

            // callback
            this.options.onNewImage(fileName);
        }

        // create the image from the screenshot
        this.createImage(fileName, screenshot, 'actual');

        // run comparison between images
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
        const tolerance = this.options.tolerance;
        const result = await this.options.imageComparisonFn(fileName, tolerance);

        this.addResult(result);
    }

    /**
     * @name getImageUrl
     *
     * @private
     * @param {string} fileName
     * @param {Type} type
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
    private createFolders(): void {
        const folders = [
            `${this.options.screenshotsPath}/standard`,
            `${this.options.screenshotsPath}/actual`,
            `${this.options.screenshotsPath}/diff`
        ];

        folders
            .filter(folder => existsSync(folder) === false)
            .forEach(folder => mkdirSync(folder));
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
        const actual = createWriteStream(this.getImageUrl(fileName, type), {flags: 'w'});
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
    private addResult(result: Result): void {
        if (this.options.debug) {
            console.log(result);
        }

        this.results = [...this.results, result];
    }
}
