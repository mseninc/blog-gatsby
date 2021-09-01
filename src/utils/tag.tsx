import { kebabCase } from "lodash"
import slugs from "../data/tag-slug"

export function tagNameToSlug(tagName: string) {
  return tagName in slugs ? slugs[tagName] as string : kebabCase(tagName)
}

export function tagNameToPageUrl(tagName: string) {
  return `/tags/${tagNameToSlug(tagName)}/`
}
