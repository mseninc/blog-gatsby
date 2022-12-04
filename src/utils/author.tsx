import { kebabCase } from "lodash"

export function authorToSlug(author: string) {
  return kebabCase(author)
}

export function authorToPageUrl(author: string) {
  return `/authors/${authorToSlug(author)}/`
}
