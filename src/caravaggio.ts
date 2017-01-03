import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Options, Type, Result } from './types';
import { defaults, takeScreenshot, log, getFolders } from './helpers';

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

        if (this.options.isEnabled) {
            // generate folders based on the option passed
            this.createFolders(this.options.screenshotsPath);
        }
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
    public capture(fileName: string, selector?: string) {
        if (this.options.isEnabled === false) {
            return;
        }

        const standard = this.getImageUrl(fileName, 'standard');

        // if the standard image does not exit - create the baseline
        if (existsSync(standard) === false) {
            log(`${fileName} does not exist. It will be generated as standard image.`);

            // create the baseline image
            this.createImage(fileName, 'standard', selector);

            // callback
            this.options.onNewImage(fileName);
        } else {
            // create the image from the screenshot
            this.createImage(fileName, 'actual', selector).then(() => {
                // run comparison between images
                this.runComparison(fileName);
            });
        }
    }

    /**
     * @name clear
     *
     * @memberOf Caravaggio
     */
    public clearAll(): void {
        this.results = [];
    }

    /**
     * @name clearResult
     * @param result
     */
    public clearResult(result: Result) {
        this.results = this.results.filter(_result => _result !== result);
    }

    /**
     * @name runComparison
     * @param {string} fileName
     *
     * @memberOf Caravaggio
     */
    private runComparison(fileName: string) {
        const options = {
            tolerance: this.options.tolerance,
            fileName,
            standardPath: this.getImageUrl(fileName, 'standard'),
            actualPath: this.getImageUrl(fileName, 'actual'),
            diffPath: this.getImageUrl(fileName, 'diff')
        };

        this.options.imageComparisonFn(options).then((result: Result) => {
            if (this.options.debug) {
                log(JSON.stringify(result));
            }

            this.addResult(result);
        });
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
     * @name addResult
     *
     * @private
     * @param {Result} result
     *
     * @memberOf Caravaggio
     */
    private addResult(result: Result): void {
        this.results = [...this.results, result];
    }

    /**
     * @name createFolders
     *
     * @private
     *
     * @memberOf Caravaggio
     */
    private createFolders(screenshotsPath: string): void {
        getFolders(screenshotsPath)
            .filter(folder => existsSync(folder) === false)
            .forEach(folder => mkdirSync(folder));
    }

    /**
     * @name createImage
     *
     * @private
     * @param {string} fileName
     * @param {Type} type
     * @param {string} selector
     *
     * @memberOf Caravaggio
     */
    private createImage(fileName: string, type: Type, selector?: string) {
        const url = this.getImageUrl(fileName, type);

        return takeScreenshot(selector).then(data => {
            const actual = createWriteStream(url, {flags: 'w'});
            actual.write(new Buffer(data, 'base64'));
            actual.end();
        });
    }
}
