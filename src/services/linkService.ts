import { LinkRepository } from '../repositories/linkRepository.ts'
import { PasswordUtils } from '../utils/passwordUtils.ts'
import { Link, CreateLinkData, RedirectResult } from '../types/index.ts'
import { env } from '../config/env.ts'
import {
  ConflictError,
  ValidationError,
  NotFoundError,
} from '../errors/index.ts'

import { AppError } from '../errors/AppError.ts'

const API = env.apiUrl
if (!API) throw new AppError('UNDEFINED_URL', 500)

export class LinkService {
  constructor(private linkRepository: LinkRepository) {}

  async createLink(linkData: CreateLinkData): Promise<Link> {
    const { url, code, password, custom } = linkData

    if (url.includes(API)) throw new ValidationError('RECURSIVE_LINK')

    const isProtected = Boolean(password)
    const passwordHash = password ? await PasswordUtils.hash(password) : null

    if (!custom && !isProtected) {
      const existing = await this.linkRepository.findByUrl(url)
      if (existing) {
        return existing
      }
    }

    const existingLink = await this.linkRepository.findByCode(code)
    if (existingLink) {
      // TODO: CHECK EXPIRED LINKS
      throw new ConflictError('CODE_TAKEN')
    }

    return await this.linkRepository.create({
      url,
      code,
      passwordHash,
      protected: isProtected,
      custom,
    })
  }

  async getLinkInfo(code: string) {
    const link = await this.linkRepository.findByCode(code)

    if (!link) {
      throw new NotFoundError('NOT_FOUND')
    }

    return {
      protected: link.protected,
      url: link.protected ? null : link.url,
      clicks: link.clicks,
    }
  }

  async unlockLink(code: string, password?: string): Promise<string> {
    const link = await this.linkRepository.findByCode(code)
    if (!link) throw new NotFoundError('NOT_FOUND')
    if (!link.passwordHash || !password)
      throw new ValidationError('NOT_PROTECTED')

    const match = await PasswordUtils.compare(password, link.passwordHash)
    if (!match) throw new ValidationError('INVALID_PASSWORD')

    return link.url
  }

  async deleteLink(code: string): Promise<void> {
    const deleted = await this.linkRepository.deleteByCode(code)

    if (!deleted) {
      throw new NotFoundError('NOT_FOUND')
    }
  }

  async handleRedirect(code: string): Promise<RedirectResult> {
    const link = await this.linkRepository.findByCode(code)
    if (!link) throw new NotFoundError('NOT_FOUND')

    if (link.protected) return { protected: true }

    // await this.linkRepository.incrementClicks(code)

    return { protected: false, url: link.url }
  }
}
