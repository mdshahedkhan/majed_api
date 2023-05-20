import express from "express"
import path from "path"
import FileExtensionAllowed from "./middlewares/FileExtensionAllowed.js";
import fileUpload from "express-fileupload"
import {destroyPreviousRequestedImg, destroyView, PdfImageExtract} from "./controllers/PdfImageExtractorController.js";


const app = express()
const PORT = process.env.PORT || 8000
app.set("view engine", "ejs")
app.set("views", path.resolve('views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('public')))
app.get("/", (req, res) => {
    res.render('index')
})
app.post("/", fileUpload({ createParentPath: true }), FileExtensionAllowed, PdfImageExtract)
// Reset Public Folder
app.post('/destroy', destroyPreviousRequestedImg)
app.get('/destroy', destroyView)
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})