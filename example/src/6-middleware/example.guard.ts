import {
    MiddlewareFunction,
} from '../import';

export const exampleGuard: MiddlewareFunction = async () => {
    const authorized = false;
    if (!authorized) {
        throw new Error(`Unauthorized`);
    }
};
