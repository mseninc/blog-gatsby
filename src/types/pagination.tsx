/**
 * Page context for gatsby-awesome-pagination
 * https://www.gatsbyjs.com/plugins/gatsby-awesome-pagination/
 */
export interface PageContext {
  /**
   * The page number (starting from 0)
   */
  pageNumber: number
  /**
   * The page number (starting from 1) for human consumption
   */
  humanPageNumber: number
  /**
   * The $skip you can use in a GraphQL query
   */
  skip: number
  /**
   * The $limit you can use in a GraphQL query
   */
  limit: number
  /**
   * The total number of pages
   */
  numberOfPages: number
  /**
   * The path to the previous page or undefined
   */
  previousPagePath: string
  /**
   * The path to the next page or undefined
   */
  nextPagePath: string
}
