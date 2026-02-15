import { writable, derived } from 'svelte/store'

// Initialize stores with localStorage values, with fallbacks
export const dark = writable(
  typeof window !== 'undefined' 
    ? parseInt(localStorage.getItem('dark') || '0') || 0 
    : 0
)

export const fontSize = writable(
  typeof window !== 'undefined' 
    ? parseInt(localStorage.getItem('fontSize') || '13') || 13 
    : 13
)

export const width = writable(
  typeof window !== 'undefined' 
    ? parseInt(localStorage.getItem('width') || '750') || 750 
    : 750
)

export const wordCount = writable({})

export const siteFont = writable(
  typeof window !== 'undefined' 
    ? localStorage.getItem('WrittenFont') || 'AGaramond'
    : 'AGaramond'
)

// Derived stores for calculated values
export const percent = derived(wordCount, $wordCount => {
  const writtenCount = $wordCount['Written'] || 0
  const unwrittenCount = $wordCount['Unwritten'] || 0
  const total = writtenCount + unwrittenCount
  
  if (total === 0) return 0
  
  let num = Math.round((writtenCount / total) * 1000) / 10
  return isNaN(num) ? 0 : num
})

export const wordCountWritten = derived(wordCount, $wordCount => $wordCount['Written'] || 0)

export const wordCountUnwritten = derived(wordCount, $wordCount => {
  const writtenCount = $wordCount['Written'] || 0
  const unwrittenCount = $wordCount['Unwritten'] || 0
  const sum = writtenCount + unwrittenCount
  return isNaN(sum) ? 0 : sum
})

// Set up localStorage subscriptions for browser environment only
if (typeof window !== 'undefined') {
  dark.subscribe(val => localStorage.setItem('dark', val.toString()))
  fontSize.subscribe(val => localStorage.setItem('fontSize', val.toString()))
  width.subscribe(val => localStorage.setItem('width', val.toString()))
  siteFont.subscribe(val => localStorage.setItem('WrittenFont', val))
} 