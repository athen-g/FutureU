import { useEffect } from 'react'

const BASE_TITLE = 'FutureU'

/**
 * Sets the document title and meta description dynamically.
 * @param {string} title - The page-specific title
 * @param {string} description - The page-specific meta description
 */
export function useMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    
    let metaDescription = document.querySelector('meta[name="description"]')
    let createdMeta = false
    let previousDescription = ''

    if (!metaDescription && description) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
      createdMeta = true
    } else if (metaDescription) {
      previousDescription = metaDescription.getAttribute('content') || ''
    }

    if (title) {
      document.title = title.includes(BASE_TITLE) ? title : `${title} | ${BASE_TITLE}`
    }

    if (description && metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (createdMeta) {
        if (metaDescription && metaDescription.parentNode) {
          metaDescription.parentNode.removeChild(metaDescription)
        }
      } else if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription)
      }
    }
  }, [title, description])
}
