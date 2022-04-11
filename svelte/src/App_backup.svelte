<script>

  // import Editor from './Editor.svelte'
  import Editor from './Editor.svelte'
  import Heart from './Heart.svelte'
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { wordCount, 
    percent, 
    wordCountWritten, 
    wordCountUnwritten, 
    dark, 
    fontSize } from './store.js'

  let menu = false

  // Dark Mode
  $: document.documentElement.setAttribute('class', $dark ? 'dark-mode' : '')

  // Change Width
  let width = parseInt(localStorage.getItem('width')) || 750
  $: localStorage.setItem('width', width)
  $: if (width > 1200) { width -= 25 } 
    else if (width < 250) { width += 25 }

  onMount(() => {
    document.styleSheets[0].insertRule(`
      .ce-paragraph, .cdx-block, .ce-block__content, .ce-block { 
        margin: 0 auto;
        max-width: ${width}px;
      }`)
  })

  function changeWidth (num) {
    let index = document.styleSheets[0].cssRules.length
    document.styleSheets[0].insertRule(`
      .ce-paragraph, .cdx-block, .ce-block__content, .ce-block { 
        margin: 0 auto;
        max-width: ${width += num}px !important;
      }`, index)
  }

  // Change Font Size
  $: if ($fontSize > 30) { $fontSize -= 1 } 
    else if ($fontSize < 1) { $fontSize += 1 }

  function clear() {
    function listener(e) {
      e.clipboardData.setData("text/html", document.body.innerHTML)
      e.clipboardData.setData("text/plain", document.body.innerText)
      e.preventDefault()
    }
    document.addEventListener("copy", listener)
    document.execCommand("copy")
    document.removeEventListener("copy", listener)
    localStorage.clear()
    location.reload()
  }

</script>


<body>

  <!-- Menu  -->
  <button 
    style="position: fixed; bottom: 16px; left: 16px;"
    on:click={() => menu = !menu}>
    🦆
  </button>

  {#if menu}
    <div 
      class=menu 
      in:fly={{ x: -200, duration: 350 }} 
      out:fade>
      <button
        on:click={clear}>
        ❌
      </button>
      <button 
        on:click={() => $fontSize += 1}>
        ➕
      </button>
      <button 
        on:click={() => $fontSize -= 1}>
        ➖
      </button>
      <button 
        on:click={() => changeWidth(-25)}>
        ▶◀
      </button>
      <button 
        on:click={() => changeWidth(25)}>
        ◀▶
      </button>
      <button 
        on:click={() => $dark ? $dark = 0 : $dark = 1}> 
        {$dark ? '🌞' : '🌙'}
      </button>
    </div>
  {/if}

  <!-- Editor  -->

  <div class='editor {$dark ? 'dark-mode' : ''}'>
    <Editor editorName='Written'/>
    <Editor editorName='Unwritten'/>
  </div>

  <!-- Progress  -->
  <div class='progress {$dark ? 'dark-mode' : ''}'>
    {$wordCountWritten} / {$wordCountUnwritten > -1 ? $wordCountUnwritten : '?'}
    <h2 style='margin: 8px; font-size: 22px;'>{$percent}%</h2>
    <progress value={$percent} style='width: 100%' max='100'></progress>
    <br />
    {#if $percent == 100 && $wordCountWritten > 100}
      <div style="position:fixed; bottom: 111px;" >
        <Heart />
      </div>
    {/if}
  </div>

</body>


<style>

  /* Global & Editors */
  body {
    width: 88%;
    margin: 0 auto;
    position: relative;
    padding: 8px;
    font-family: 'Graphik', 'AGaramond', 'Lyon'; 
    max-width: 1200px;
  }

  :global(div.codex-editor__redactor) {
    padding-bottom: 50px !important;
  }
  
  :global(.dark-mode) {
    background-color: #373737;
    color: #F6F6F6;
  }

  @font-face {
    font-family: 'AGaramond';
    src: url('/AGaramondPro-Regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Graphik';
    src: url('/Graphik-Regular-Web.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Lyon';
    src: url('/Lyon-Text-Regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Noe';
    src: url('/Noe-Text-Black.woff2') format('woff2');
  }

  /* Menu */
  .menu {
    bottom: 80px;
    left: 16px;
    overflow: hidden;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: auto;
    width: auto;
    border-radius: 15px;
    z-index: 3
  }

  button {
    background: white;
    border: 1px solid gray;
    border-radius: 50%;
    outline: none;
    font-size: 17px;
    height: 43px;
    width: 43px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 6px;
    z-index: 3;
  }

  button:focus {
    background: #F7E5FF;
  }

  /* Progress */
  .progress {
    background: white;
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 20px;
    border: solid purple 1px;
    border-radius: 4px;
    justify-content: center;
    align-content: center;
    text-align: center;
    width: 100px;
    z-index: 3;
  }

  .dark-mode.progress {
    background: #373737;
    border: solid yellow 1px;
    color: #F6F6F6;
  }

</style>