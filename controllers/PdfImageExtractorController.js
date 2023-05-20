import {exportImages} from "pdf-export-images";
import path from "path";
import fs from "fs";

import {createRequire} from "module";

const customRequireOnce = createRequire(import.meta.url)
const pdfJS = customRequireOnce('pdfjs-dist')


function FilterDethOfBirthAndNIdNumber(info){
    let FilterDobElement = [];
    let filterElement = []


    info.map(item => {
        if (item.trim().length === 10) {
            let newItem = item.replace(/^\d{4}?\d{2}?\d{2}?/g, '$1-$2-$3')
            FilterDobElement.push(newItem)
        }
    })
    
    for (let index = 0; index < info.length; index++) {
        const element = info[index]
        if (element.length === 17 && /^\d+$/.test(element)) {
            filterElement['nid'] = element
            if (/^\d+$/.test(filterElement['nid'])) {
                filterElement['nid']
                break
            }
        }
    }
    let index = 0
    FilterDobElement.map(item => {
        let nextItem = item.substr(0, 4)
        if (index === 1 || index === 2 && isNumber(nextItem)) {
            filterElement['dob'] = item
        }
        index++
    })

    return filterElement
}

function isNumber(value){
    return /^\d+$/.test(value)
}


export async function PdfImageExtract(req, res) {
    let responseImage = { photoIMG: "", signatureIMG: '', originals: [] }
    let requestedPdf = req.files.pdf
    let baseUrl = `${req.protocol}://${req.get('host')}/`
    let response = await exportImages(requestedPdf, path.resolve("public")).then(async (res) => {
        return res
    })
    for (let createImage of response) {
        if (createImage.name === 'img_p0_2') {
            responseImage['signatureIMG'] = `${baseUrl}${createImage.name}.png`
        }
        if (createImage.name === 'img_p0_1') {
            responseImage['photoIMG'] = `${baseUrl}${createImage.name}.png`
        }
    }

    let publicFileSync = fs.readdirSync('public')
    if (publicFileSync.length) {
        for (let scanItem of publicFileSync) {
            let fileExtension = scanItem.split('.')
            if (fileExtension.pop() === 'png') {
                responseImage['originals'].push(`${baseUrl}${scanItem}`)
            }
        }
    }

    let rawPdfInformation = await getItems(requestedPdf)
    let newResponse = await FilterDethOfBirthAndNIdNumber(rawPdfInformation)

    res.json({ data: responseImage,  info: Object.entries(newResponse)})
    res.end()
}


async function getContent(src) {
    const document = await pdfJS.getDocument(src).promise
    const page = await document.getPage(1)
    return await page.getTextContent()
}

async function getItems(src) {
    const content = await getContent(src)
    let newContent = []
    let items = await content.items
    for (let contentItem of items) {
        if (contentItem.str.trim()) {
            newContent.push(contentItem.str)
        }
    }
    return newContent
}


export async function destroyPreviousRequestedImg(req, res) {
    let dirScan = fs.readdirSync(`${path.resolve('public')}`)
    if (dirScan) {
        for (const image in dirScan) {
            if (Object.hasOwnProperty.call(dirScan, image)) {
                let element = dirScan[image]
                let fileExtension = element.split('.').pop()
                if (fileExtension === 'png') {
                    if (fs.existsSync(`${path.resolve('public')}/${element}`)) {
                        await fs.unlinkSync(path.resolve(`public/${element}`))
                    }
                }


            }
        }
    }
    res.status(200).json({ message: "Public directory has been successfully rested." })
}

export function destroyView(req, res) {
    res.render('destroy')
}