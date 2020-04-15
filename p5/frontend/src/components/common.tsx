export interface Parameter {
    name: string,
    type: string,
}

export interface Results {
    date: Date,
    vars: string[],
    result: string
}

export interface Algorithm {
    name: string,
    parameters: Parameter[],
    results: Results[]
}