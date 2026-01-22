import { LinkModel } from "../database/models/link.ts"
import type { Link } from "../types/index.ts"
import type { CreateLinkData } from "../types/index.ts"

export class LinkRepository {
    async findByCode(code: string): Promise<Link | null> {
        return LinkModel.findOne({ code })
    }

    async findByUrl(url: string): Promise<Link | null> {
        return LinkModel.findOne({
            url,
            custom: false,
            protected: false,
        })
    }

    async create(data: CreateLinkData): Promise<Link> {
        return LinkModel.create(data)
    }

    async incrementClicks(code: string): Promise<void> {
        await LinkModel.updateOne({ code }, { $inc: { clicks: 1 } })
    }

    async deleteByCode(code: string): Promise<boolean> {
        const result = await LinkModel.deleteOne({ code })
        return result.deletedCount === 1
    }
}
