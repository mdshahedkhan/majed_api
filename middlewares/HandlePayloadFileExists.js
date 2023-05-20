const HandlePayloadFileExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "Error", message: "Missing Files." })
    return next()
}


module.exports = HandlePayloadFileExists