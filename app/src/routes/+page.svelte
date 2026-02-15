<script>
  import Editor from '$lib/Editor.svelte'
  import { fly, fade } from 'svelte/transition'
  import { wordCount, percent, wordCountWritten, wordCountUnwritten, dark, fontSize, width, siteFont } from '$lib/store.js'
  import SvelteTooltip from 'svelte-tooltip'
  import { Confetti } from 'svelte-confetti'
  import { onMount } from 'svelte'

  let menu = $state(false)
  let title = $state('Draft')
  let editTitle = $state(false)
  let showProgress = $state(true)

  // Initialize title from localStorage
  onMount(() => {
    if (typeof window !== 'undefined') {
      title = localStorage.getItem(`Title`) || 'Draft'
    }
  })

  // Save title to localStorage when it changes
  $effect(() => {
    if (typeof window !== 'undefined' && title) {
      localStorage.setItem(`Title`, title)
    }
  })

  // Dark Mode - Update document class
  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('class', $dark ? 'dark-mode' : '')
    }
  })

  // Keep width within range.
  $effect(() => {
    if ($width > 1200) {
      width.set($width - 25)
    } else if ($width < 500) {
      width.set($width + 25)
    }
  })

  // Keep font within range.
  $effect(() => {
    if ($fontSize > 30) {
      fontSize.set($fontSize - 1)
    } else if ($fontSize < 1) {
      fontSize.set($fontSize + 1)
    }
  })

  function clear() {
    function listener(e) {
      e.clipboardData.setData('text/html', document.body.innerHTML)
      e.clipboardData.setData('text/plain', document.body.innerText)
      e.preventDefault()
    }
    document.addEventListener('copy', listener)
    document.execCommand('copy')
    document.removeEventListener('copy', listener)
    localStorage.clear()
    location.reload()
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<body>
  <!-- Title  -->
  <div class="title" class:dark-mode={$dark}>
    {#if editTitle}
      <h2 style="font-family: {$siteFont}">
        <input bind:value={title} onfocusout={() => (editTitle = !editTitle)} autofocus />
      </h2>
    {:else}
      <h2 style="font-family: {$siteFont};" onclick={() => (editTitle = !editTitle)}>{title}</h2>
    {/if}
  </div>

  <!-- Menu  -->
  <div class="menu-button">
    <SvelteTooltip tip="Menu" right color="#c4f1d4">
      <button class:dark-mode={$dark} onclick={() => (menu = !menu)}> 🦆 </button>
    </SvelteTooltip>
  </div>

  {#if menu}
    <div class="menu" in:fly={{ y: 20, duration: 350 }} out:fly={{ y: 20, duration: 350 }}>
      <SvelteTooltip tip="User Guide" right color="#c4f1d4">
        <button class:dark-mode={$dark}>
          <a
            href="https://rchangmh.notion.site/Draft-User-Guide-b684384749844803a4e11b298a74c7a9"
            target="_blank"
            style="text-decoration: none">📗</a
          >
        </button>
      </SvelteTooltip>
      <SvelteTooltip tip="Increase Font Size" right color="#c4f1d4">
        <button class:dark-mode={$dark} onclick={() => fontSize.update(f => f + 1)}> ➕ </button>
      </SvelteTooltip>
      <SvelteTooltip tip="Decrease Font Size" right color="#c4f1d4">
        <button class:dark-mode={$dark} onclick={() => fontSize.update(f => f - 1)}> ➖ </button>
      </SvelteTooltip>
      <SvelteTooltip tip="Expand Text" right color="#c4f1d4">
        <button class:dark-mode={$dark} onclick={() => width.update(w => w + 25)}> ◀▶ </button>
      </SvelteTooltip>
      <SvelteTooltip tip="Narrow Text" right color="#c4f1d4">
        <button class:dark-mode={$dark} onclick={() => width.update(w => w - 25)}> ▶◀ </button>
      </SvelteTooltip>
      <SvelteTooltip tip="Dark/Light Mode" right color="#c4f1d4">
        <button class:dark-mode={$dark} onclick={() => dark.update(d => d ? 0 : 1)}>
          {$dark ? '🌞' : '🌙'}
        </button>
      </SvelteTooltip>
    </div>
  {/if}

  <!-- Editor  -->
  <div class="editor" class:dark-mode={$dark}>
    <Editor editorName="Written" />
    <Editor editorName="Unwritten" />
  </div>

  <!-- Progress  -->
  {#if showProgress}
    <div
      style="font-family: {$siteFont}"
      class="progress" class:dark-mode={$dark}
      onclick={() => (showProgress = !showProgress)}
      in:fly={{ y: 20, delay: 250, duration: 350 }} out:fly={{ y: 20, duration: 350 }}
    >
      {$wordCountWritten} / {$wordCountUnwritten > -1 ? $wordCountUnwritten : '?'}
      <h2 style="margin: 8px; font-size: 22px;">{$percent}%</h2>
      <progress value={$percent} style="width: 100%" max="100" />
      <br />
      {#if $percent == 100 && $wordCountWritten > 200}
        <div
          style="
            position: fixed;
            top: -100px;
            left: 0;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            overflow: hidden;
            pointer-events: none;"
        >
          <Confetti
            size="85"
            rounded
            x={[-5, 5]}
            y={[0, 0.1]}
            delay={[0, 2000]}
            infinite
            duration="5000"
            amount="42"
            fallDistance="100vh"
            colorArray={['url(/ace.jpg)']}
          />
        </div>
        <Confetti size="15" infinite amount="40" />
      {/if}
    </div>
  {:else}
    <div class="progress-button">
      <button 
        class:dark-mode={$dark}
        onclick={() => (showProgress = !showProgress)}
        in:fade={{ y: 20, delay: 250, duration: 250 }} out:fade={{ y: 20, duration: 50 }}
      > 🫥 </button>
    </div>
  {/if}
</body>

<style>
  /* Global & Editors */
  :global(html, body) {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    width: 88%;
    margin: 0 auto;
    position: relative;
    padding: 8px;
    font-family: 'Roboto';
  }

  .title {
    text-align: center;
    height: 20px;
    font-size: 30px;
  }
  
  .title h2 {
    font-weight: normal;
  }

  .title input {
    border: none;
    outline: none;
    text-align: center;
    height: 50px;
  }

  :global(.dark-mode) {
    background-color: #373737;
    color: #f6f6f6;
  }

  /* Font Face Declarations */
  @font-face {
    font-family: 'AGaramond';
    src: url('/fonts/AGaramondPro-Regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Graphik';
    src: url('/fonts/Graphik-Regular-Web.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Lyon';
    src: url('/fonts/Lyon-Text-Regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Argentina';
    src: url('/fonts/Argentina-Script.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Overpass';
    src: url('/fonts/Overpass.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Overpass Mono';
    src: url('/fonts/OverpassMono.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/Roboto.woff2') format('woff2');
  }

  /* Menu */
  .menu {
    bottom: 80px;
    left: 16px;
    overflow: visible;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: auto;
    width: auto;
    border-radius: 15px;
    z-index: 3;
  }

  .menu-button {
    bottom: 16px;
    left: 16px;
    position: fixed;
  }

  .progress-button {
    bottom: 16px;
    right: 16px;
    position: fixed;
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

  button.dark-mode {
    background: #7e6e83;
  }

  button:hover {
    background: #f7e5ff;
  }

  /* Progress */
  .progress {
    background: none;
    background-color: hsla(0, 0%, 100%, 0.5);
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 20px;
    border: solid 1px;
    border-radius: 9px;
    justify-content: center;
    align-content: center;
    text-align: center;
    width: 100px;
    height: 75px;
    z-index: 3;
  }

  .progress:hover {
    cursor: pointer;
    opacity: .35;
  }

  .dark-mode.progress {
    background-color: hsla(0, 0%, 16%, 0.5);
    border: solid white 1px;
    color: #f6f6f6;
  }
</style>
