export default function (req, res, next) {
    if (req.files) {
        let extension = req.files.pdf.name.split('.').pop()
        if (extension === 'pdf') {
            return next()
        }
    }
    return res.status(400).json({ status: 'error', message: 'file not allow.' })
}