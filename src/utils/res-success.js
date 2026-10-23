export const resSuccess = (res, data, status = 200) => {
    res.status(status).json({ status: 'success', data });
};