import { $state, $derived, $effect } from 'svelte'

// Helper function to persist state to localStorage
function persistentState(key, initialValue) {
  let value = $state(parseInt(localStorage.getItem(key)) || initialValue)
  
  $effect(() => {
    localStorage.setItem(key, value.toString())
  })
  
  return {
    get value() { return value },
    set value(v) { value = v }
  }
}

export const dark = persistentState('dark', 0)
export const fontSize = persistentState('fontSize', 13) 
export const width = persistentState('width', 750)

export let wordCount = $state({})

export const percent = $derived(() => {
  let num = Math.round((wordCount['Written'] / (wordCount['Unwritten'] + wordCount['Written'])) * 1000) / 10
  return isNaN(num) ? 0 : num
})

export const wordCountWritten = $derived(() => wordCount['Written'])

export const wordCountUnwritten = $derived(() => {
  let sum = wordCount['Unwritten'] + wordCount['Written']
  return isNaN(sum) ? 0 : sum
})

// String state for siteFont
function persistentStringState(key, initialValue) {
  let value = $state(localStorage.getItem(key) || initialValue)
  
  $effect(() => {
    if (value) localStorage.setItem(key, value)
  })
  
  return {
    get value() { return value },
    set value(v) { value = v }
  }
}

export const siteFont = persistentStringState('WrittenFont', '')