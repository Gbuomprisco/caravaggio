export interface Options {
    screenshotsPath: string;
    tolerance: number;
    debug: boolean;
    isEnabled: boolean;

    // resolutions?: number[]

    onFailure: (...args) => any;
    onSuccess: (...args) => any;
    onComplete: (...args) => any;
    onNewImage: (...args) => any;

    imageComparisonFn: (ImageComparisonOptions) => Promise<Result>;
}

export type Type = 'actual' | 'standard' | 'diff';

export interface Result {
    hasPassed: boolean;
    differences: number;
    name: string;
}

export interface ImageComparisonOptions {
    fileName: string;
    tolerance: number;
    standardPath: string;
    diffPath: string;
    actualPath: string;
}
