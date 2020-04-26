export const BACKEND_URL = 'http://localhost:4000/api';

export interface Parameter {
    name: string,
    type: string,
}

export interface Result {
    date: Date,
    vars: string[],
    result: {
        console: string,
        file: string
    }
}

export interface Service {
    name: string,
    parameters: Parameter[],
    results: Result[]
}