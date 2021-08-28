import { kebabCase } from "lodash"

export function tagNameToSlug(tagName: string) {
  return kebabCase(tagName)
}

export function tagNameToPageUrl(tagName: string) {
  return `/tags/${tagNameToSlug(tagName)}/`
}
