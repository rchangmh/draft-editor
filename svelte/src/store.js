import { writable, derived } from 'svelte/store'

export const dark = writable(parseInt(localStorage.getItem('dark')) || 0)
dark.subscribe(val => localStorage.setItem('dark', val))

export const fontSize = writable(parseInt(localStorage.getItem('fontSize')) || 13)
fontSize.subscribe(val => localStorage.setItem('fontSize', val))

export const width = writable(parseInt(localStorage.getItem('width')) || 750)
width.subscribe(val => localStorage.setItem('width', val))

export const wordCount = writable({})

export const percent = derived(wordCount, $wordCount => {
  let num = Math.round((wordCount['Written'] / (wordCount['Unwritten'] + wordCount['Written'])) * 1000) / 10
  return isNaN(num) ? 0 : num
})

export const wordCountWritten = derived(wordCount, $wordCount => wordCount['Written'])

export const wordCountUnwritten = derived(wordCount, $wordCount => {
  let sum = wordCount['Unwritten'] + wordCount['Written']
  return isNaN(sum) ? 0 : sum
})

export const siteFont = writable(localStorage.getItem('WrittenFont'))
siteFont.subscribe(val => localStorage.setItem('WrittenFont', val))