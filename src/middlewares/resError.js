export const resError = (err, req ,res, next) => {
    res.status(err?.statusCode || 500).send({ status: 'error', error: { message: err?.message || err }});
};