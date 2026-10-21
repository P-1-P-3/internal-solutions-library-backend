export const catchError = (fn) => {
    return (req, res, next) => {
        fn(req, res).catch((error) => { next(error) });
    };
};