import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'

export const dark = writable(browser ? parseInt(localStorage.getItem('dark')) || 0 : 0)
dark.subscribe(val => browser && localStorage.setItem('dark', val))

export const fontSize = writable(browser ? parseInt(localStorage.getItem('fontSize')) || 13 : 13)
fontSize.subscribe(val => browser && localStorage.setItem('fontSize', val))

export const width = writable(browser ? parseInt(localStorage.getItem('width')) || 750 : 750)
width.subscribe(val => browser && localStorage.setItem('width', val))

export const wordCount = writable({})

export const percent = derived(wordCount, $wordCount => {
  let num = Math.round(($wordCount['Written'] / ($wordCount['Unwritten'] + $wordCount['Written'])) * 1000) / 10
  return isNaN(num) ? 0 : num
})

export const wordCountWritten = derived(wordCount, $wordCount => $wordCount['Written'])

export const wordCountUnwritten = derived(wordCount, $wordCount => {
  let sum = $wordCount['Unwritten'] + $wordCount['Written']
  return isNaN(sum) ? 0 : sum
})

export const siteFont = writable(browser ? localStorage.getItem('WrittenFont') : null)
siteFont.subscribe(val => browser && localStorage.setItem('WrittenFont', val))
