<script>
  import { onMount } from 'svelte'
  import { wordCount, dark, fontSize, width } from './store.js'
  import SvelteTooltip from 'svelte-tooltip'
  export let editorName

  onMount(() => {
    updateWordCount(document.getElementById(editorName).innerText)
  })

  let innerHtml = localStorage.getItem(`${editorName}Html`) || ''
  $: localStorage.setItem(`${editorName}Html`, innerHtml)

  // let width = localStorage.getItem(`width`) || ''
  // $: localStorage.setItem(`width`, width)

  function updateWordCount(innerText) {
    let count = 0
    innerText.split('\n').forEach(p => {
      if (p != '') {
        count += p.split(' ').length
      }
    })
    wordCount.update(() => (wordCount[editorName] = count))
  }

  // Title
  let editTitleToggle = false
  let title = localStorage.getItem(`${editorName}Title`) || ''
  $: localStorage.setItem(`${editorName}Title`, title)

  // Font
  let fontFamily = localStorage.getItem(`${editorName}Font`) || 'AGaramond'
  $: localStorage.setItem(`${editorName}Font`, fontFamily)
  let fonts = ['AGaramond', 'Lyon', 'Garamond', 'Graphik', 'Consolas']

  function isLink() {
    if (window.getSelection().toString !== '') {
      const selection = window.getSelection().getRangeAt(0)
      if (selection) {
        if (selection.startContainer.parentNode.tagName === 'A' || selection.endContainer.parentNode.tagName === 'A') {
          return [true, selection]
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }

  function convertToPlain(html) {
    var tempDivElement = document.createElement('div')
    tempDivElement.innerHTML = html
    return tempDivElement.textContent || tempDivElement.innerText || ''
  }

  function save() {
    let d = new Date()
    let mm = `${d.getMonth()}`.padStart(2, '0')
    let dd = `${d.getDate()}`.padStart(2, '0')
    let yyyy = d.getFullYear()
    let hr = `${d.getHours()}`.padStart(2, '0')
    let min = `${d.getMinutes()}`.padStart(2, '0')
    let sec = `${d.getSeconds()}`.padStart(2, '0')
    let date_key = `autosave_${editorName} ${mm}/${dd}/${yyyy} ${hr}:${min}:${sec}`
    localStorage.setItem(date_key, innerHtml)
    navigator.clipboard.writeText(convertToPlain(innerHtml))
    // let focusNode = window.getSelection().focusNode
    // if (focusNode.parentElement.id == editorName) {
    //   localStorage.setItem(date_key, innerHtml)
    // }
  }

  function handleKeydown(e) {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.key == 'k') {
      e.preventDefault()
      if (!isLink()) {
        document.execCommand('CreateLink', false, window.prompt('URL: '))
      } else {
        document.execCommand('unlink', false)
      }
    }
    // else if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key == 's') {
    //   e.preventDefault()
    //   handleCopy()
    // }
  }

  function handleCopy() {
    save()
    innerHtml = replaceAll(innerHtml, [
      ['--', '—'],
      [' "', ' “'],
      ['" ', '” '],
      ["'", '’'],
    ])
    function listener(e) {
      e.clipboardData.setData('text/html', innerHtml)
      e.clipboardData.setData('text/plain', window.getSelection().focusNode)
      e.preventDefault()
    }
    document.addEventListener('copy', listener)
    document.execCommand('copy')
    document.removeEventListener('copy', listener)
  }

  function replaceAll(str, findReplaceList) {
    findReplaceList.forEach(find_replace => {
      str = str.replace(new RegExp(find_replace[0], 'g'), find_replace[1])
    })
    return str
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div>
  <!-- Header -->
  <div class="header {$dark ? 'dark-mode' : ''}">
    <div class="header-left">
      {#if editTitleToggle}
        <input
          class="header-input"
          bind:value={title}
          on:focusout={() => (editTitleToggle = !editTitleToggle)}
          autofocus
        />
      {:else}
        <h1 on:click={() => (editTitleToggle = !editTitleToggle)}>
          {title.trim() || `[${editorName.toLowerCase()}]`}
        </h1>
      {/if}
      <h1 style="white-space: nowrap;">&nbsp;— {wordCount[editorName] ? wordCount[editorName] : 0}&nbsp;</h1>
    </div>

    <div class="header-right">
      <SvelteTooltip tip="Copy & Save" bottom color={$dark ? '#71318d' : '#f7e5ff'}>
        <button class="duck {$dark ? 'dark-mode' : ''}" on:click={save}> 💾 & 📋 </button>
      </SvelteTooltip>

      <label for="font" />
      <select bind:value={fontFamily} style="font-family: {fontFamily}" class:dark-mode={$dark}>
        {#each fonts as font}
          <option value={font} style="font-family: {font}">{font}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Editor -->

  <div
    id={editorName}
    class="editor"
    style="font-size: {$fontSize * 2}px; font-family: {fontFamily}; width: {$width}px;"
    contenteditable="true"
    bind:innerHTML={innerHtml}
    on:input={e => updateWordCount(e.target.textContent)}
  />
</div>

<style>
  :global(::selection) {
    background-color: rgba(217, 245, 255, 0.5);
  }

  .editor {
    padding-top: 30px;
    padding-bottom: 100px;
    margin: 0 auto;
    width: 750px;
    outline: none;
    line-height: 1.6;
    text-indent: 0;
  }

  .header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid black;
    justify-content: space-between;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
  }

  .header-input,
  button,
  select {
    margin: 3px;
    padding: 8px;
    border: 1px solid gray;
    border-radius: 2px;
    background: inherit;
    font-size: 18px;
    height: 40px;
    align-items: center;
    justify-content: space-between;
  }

  select {
    width: 135px;
  }

  button,
  select {
    cursor: pointer;
    outline: none;
  }

  button:active {
    background: #f7e5ff !important;
  }

  button:focus,
  select:focus {
    background: #fcf0ff;
  }

  button:hover {
    background: #f7e5ff;
  }

  .dark-mode button:active {
    background: #71318d !important;
  }

  .dark-mode button:hover {
    background: #71318d !important;
  }

  .dark-mode button:focus,
  .dark-mode select:focus {
    background: #57236e;
  }

  .header-input,
  h1 {
    font-family: inherit;
    font-size: 28px;
    font-weight: bold;
  }

  .dark-mode.header {
    border-bottom: 1px solid white;
  }
</style>
