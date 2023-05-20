const MB = 5 // 5MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024

const FileSizeLimiter = function (req, res, next) {
    const RequestedFiles = req.files

    let RequestedFileOverLimit = []
    // which file over the limit
    Object.keys(RequestedFiles).forEach(key => {
        if (RequestedFiles[key].size > FILE_SIZE_LIMIT) {
            RequestedFileOverLimit.push(RequestedFiles[key].name)
        }
    })

    if (RequestedFileOverLimit.length) {

    }
    next()
}