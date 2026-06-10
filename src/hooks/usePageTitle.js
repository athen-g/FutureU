import { useEffect } from 'react'

const BASE_TITLE = 'FutureU'

/**
 * Sets the document title dynamically.
 * @param {string} pageTitle - The page-specific title (e.g., "College Directory")
 */
export function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | ${BASE_TITLE}` : BASE_TITLE
    return () => { document.title = BASE_TITLE }
  }, [pageTitle])
}
