
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
};