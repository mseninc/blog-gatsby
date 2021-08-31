import { Link } from "gatsby";
import React from "react";
import { PageContext } from "types/pagination";

type Props = {
  pathPrefix: string
  context: PageContext
};

export default function Paginator({ pathPrefix, context }: Props) {

  if (context.numberOfPages === 1) return null;

  const numbers = insertFiller(createPageNumbers(context.numberOfPages, context.humanPageNumber))

  const links = numbers
    .map(n =>
      !n
      ? <>
          <span className={`paginator-ellipse`} />
        </>
      : (
        n === context.humanPageNumber
        ? <span className={`paginator-link paginator-link-current`}>
            <span>{n}</span>
          </span>
        : <span className={`paginator-link`}>
            <Link to={n === 1 ? pathPrefix : `${pathPrefix.replace(/\/$/, '')}/${n}`}>
              {n}
            </Link>
          </span>
      )
    );

  return (
    <div className={`paginator`}>
      {links}
    </div>
  )
}

function createPageNumbers(numberOfPages: number, currentPage: number): number[] {

  if (numberOfPages <= 5) {
    return [...new Array(numberOfPages)].map((_, n) => n + 1);
  }

  const numbers =
    [...new Set([
      1, // first
      numberOfPages, // last
      currentPage,
      currentPage + 1,
      currentPage - 1,
      currentPage + 2,
      currentPage - 2,
      currentPage + 3,
      currentPage - 3,
    ].filter(n => n >= 1 && n <= numberOfPages))].splice(0, 5)

  numbers.sort((a, b) => a - b)

  return numbers
}

function insertFiller(numbers: number[]): (number | null)[] {
  const result = []
  let prev = 0
  for (const n of numbers) {
    if (prev + 1 !== n) {
      result.push(null)
    }
    result.push(n)
    prev = n
  }
  return result
}
