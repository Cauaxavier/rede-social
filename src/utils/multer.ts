import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { Request } from 'express'

const imagesDirectory = path.join(process.cwd(), 'images')

async function createDirectoryIfNotExists() {
    try {
        await fs.access(imagesDirectory)
    } catch {
        await fs.mkdir(imagesDirectory)
    }
}

createDirectoryIfNotExists()

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, imagesDirectory)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + "-" + file.originalname
        cb(null, uniqueSuffix);
    },
})

export default multer({ storage })