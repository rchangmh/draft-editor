<script>
  
  import EditorJS from '@editorjs/editorjs' 

  import { wordCount, dark, fontSize } from './store.js'
  export let editorName

  function handleKeydown (e) {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key == 's') {
      e.preventDefault()
      let d = new Date()
      let date_key = `${editorName} ${d.getMonth()}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
      let text = document.getElementById(editorName).innerText
      localStorage.setItem(date_key, text)
    }
    // localStorage.setItem()
  }

  // Title
  let editTitleToggle = false
  let title = localStorage.getItem(`${editorName}Title`) || ''
  $: localStorage.setItem(`${editorName}Title`, title)

  // Font
  let fontFamily = localStorage.getItem(`${editorName}Font`) || 'AGaramond'
  $: localStorage.setItem(`${editorName}Font`, fontFamily)
  let fonts = ['AGaramond', 'Lyon', 'Garamond', 'Graphik', 'Consolas']

  // Editor
  const editor = new EditorJS({ 
    holder: editorName, 
    logLevel: 'ERROR',
    data: JSON.parse(localStorage.getItem(`${editorName}SavedText`)) || {},
    onReady: () => handleSave()
  })

  function handleSave() {
    editor.save().then(output => {
      let count = 0
      output.blocks.forEach(block => {
        let text = block.data.text
        count += text.split(" ").length
      })
      wordCount.update(() => wordCount[editorName] = count)
      localStorage.setItem(`${editorName}SavedText`, JSON.stringify(output))
    })
  }

  function replaceAll(str, findReplaceList) {
    findReplaceList.forEach(find_replace => {
      str = str.replace(new RegExp(find_replace[0], 'g'), find_replace[1])
    })
    return str
  }

  function rerender() {
    let savedBlocks = JSON.parse(localStorage.getItem(`${editorName}SavedText`)).blocks
    editor.save().then(output => {
      output.blocks.forEach(block => {
        block.data.text = replaceAll(block.data.text, [['--', '—'], [' "', ' “'], ['" ', '” '], ['\'', '’']])
      })
    editor.render({ blocks: output.blocks })
    localStorage.setItem(`${editorName}SavedText`, JSON.stringify(output))
    })
  }

  function handleCopy() {
    let paragraphs = Array.from(document.getElementById(editorName).querySelectorAll('.ce-paragraph'))
    let html = []
    let text = []
    paragraphs.forEach(paragraph => {
      let paragraphHtml = replaceAll(paragraph.innerHTML, [['--', '—'], [' "', ' “'], ['" ', '” '], ['\'', '’']])
      html += [`<p>${paragraphHtml}</p>`]
      let paragraphText = replaceAll(paragraph.innerText, [['--', '—'], [' "', ' “'], ['" ', '” '], ['\'', '’']])
      text += [paragraphText]
    })
    copyToClip(html, text)
    rerender()
  }

  function copyToClip(html, text) {
    function listener(e) {
      e.clipboardData.setData("text/html", html)
      e.clipboardData.setData("text/plain", text)
      e.preventDefault()
    }
    document.addEventListener("copy", listener)
    document.execCommand("copy")
    document.removeEventListener("copy", listener)
  }

</script>


<svelte:window 
  on:copy={handleSave}
  on:paste={handleSave}
  on:keydown={e => handleKeydown(e)}
/>

<div>

  <!-- Header -->
  <div class='header {$dark ? 'dark-mode' : ''}'>

    <div class=header-left>
    {#if editTitleToggle}
      <input 
        bind:value={title}
        on:focusout={() => editTitleToggle = !editTitleToggle}
        autofocus
      />
    {:else}
      <h1 
        on:click={() => editTitleToggle = !editTitleToggle}>
        {title.trim() || `[${editorName.toLowerCase()}]`}
      </h1>
    {/if}
    <h1 style="white-space: nowrap;">&nbsp;— {wordCount[editorName] ? wordCount[editorName] : 0}&nbsp;</h1>
  </div>
    
    <div class=header-right>
      <button 
        class="duck {$dark ? 'dark-mode' : ''}" 
        on:click={handleCopy}>
        📋
      </button>
      <label for="font"></label>
      <select 
        bind:value={fontFamily}
        style='font-family: {fontFamily}'
        class:dark-mode={$dark}>
        {#each fonts as font}
          <option value='{font}' style='font-family: {font}'>{font}</option>
        {/each}
      </select>
    
    </div>
  </div>

  <!-- Editor -->
  <div 
    class=editor 
    id={editorName}
    on:keyup={handleSave} 
    style="font-size: {$fontSize*2}px; font-family: {fontFamily}"
  />

</div>


<style>

  .editor {
    padding: 10px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid black;
    justify-content: space-between;
  }

  .header-left, .header-right {
    display:flex;
    align-items: center;
  }

  input, button, select {
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

  button, select {
    cursor: pointer;
    outline: none;
  }

  button:active {
    background: #F7E5FF !important;
  }

  button:focus, select:focus {
    background: #FCF0FF;
  }

  .dark-mode button:active {
    background: #71318D !important;
  }

  .dark-mode button:focus, .dark-mode select:focus {
    background: #57236E;
  }

  input, h1 {
    font-family: inherit;
    font-size: 28px;
    font-weight: bold;
  }

  .dark-mode.header {
    border-bottom: 1px solid white;
  }

</style>