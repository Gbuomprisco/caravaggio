export interface Options {
    screenshotsPath: string;
    tolerance: number;
    debug: boolean;

    // resolutions?: number[]

    onFailure: (...args) => any;
    onSuccess: (...args) => any;
    onComplete: (...args) => any;
    onNewImage: (...args) => any;

    imageComparisonFn: (fileName: string, tolerance: number) => Promise<Result>;
}

export type Type = "actual" | "standard" | "diff";

export interface Result {
    hasPassed: boolean;
    differences: number;
    name: string;
}