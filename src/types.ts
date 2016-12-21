export interface Options {
    screenshotsPath: string;
    resolutions?: number[];
    threshold: number;
    debug: boolean;
}

export type Type = "actual" | "standard" | "diff";

export interface Result {
    hasPassed: boolean;
    differences: number;
    name: string;
}