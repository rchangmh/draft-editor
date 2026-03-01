<script>
  import Editor from '$lib/components/Editor.svelte'
  import { fly, fade } from 'svelte/transition'
  import { wordCount, percent, wordCountWritten, wordCountUnwritten, dark, fontSize, width, siteFont } from '$lib/stores.js'
  import { Confetti } from 'svelte-confetti'

  let menu = false

  let title = localStorage.getItem(`Title`) || 'Draft'
  $: localStorage.setItem(`Title`, title)
  let editTitle = false
  let showProgress = true

  // Dark Mode
  $: document.documentElement.setAttribute('class', $dark ? 'dark-mode' : '')

  // Keep width within range.
  $: if ($width > 1200) {
    $width -= 25
  } else if ($width < 500) {
    $width += 25
  }

  // Keep font within range.
  $: if ($fontSize > 30) {
    $fontSize -= 1
  } else if ($fontSize < 1) {
    $fontSize += 1
  }

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

<!-- Title  -->
<div class="title {$dark ? 'dark-mode' : ''}">
  {#if editTitle}
    <h2 style="font-family: {$siteFont}"><input bind:value={title} on:focusout={() => (editTitle = !editTitle)} autofocus /></h2>
  {:else}
    <h2 style="font-family: {$siteFont};" on:click={() => (editTitle = !editTitle)}>{title}</h2>
  {/if}
</div>

<!-- Menu  -->
<div class="menu-button">
  <button class="{$dark ? 'dark-mode' : ''}" title="Menu" on:click={() => (menu = !menu)}>🦆</button>
</div>

{#if menu}
  <div class="menu" in:fly={{ y: 20, duration: 350 }} out:fly={{ y: 20, duration: 350 }}>
    <button class="{$dark ? 'dark-mode' : ''}" title="User Guide">
      <a
        href="https://rchangmh.notion.site/Draft-User-Guide-b684384749844803a4e11b298a74c7a9"
        target="_blank"
        style="text-decoration: none">📗</a
      >
    </button>
    <button class="{$dark ? 'dark-mode' : ''}" title="Increase Font Size" on:click={() => ($fontSize += 1)}>➕</button>
    <button class="{$dark ? 'dark-mode' : ''}" title="Decrease Font Size" on:click={() => ($fontSize -= 1)}>➖</button>
    <button class="{$dark ? 'dark-mode' : ''}" title="Expand Text" on:click={() => ($width += 25)}>◀▶</button>
    <button class="{$dark ? 'dark-mode' : ''}" title="Narrow Text" on:click={() => ($width -= 25)}>▶◀</button>
    <button class="{$dark ? 'dark-mode' : ''}" title="Dark/Light Mode" on:click={() => ($dark ? ($dark = 0) : ($dark = 1))}>
      {$dark ? '🌞' : '🌙'}
    </button>
  </div>
{/if}

<!-- Editor  -->

<div class="editor {$dark ? 'dark-mode' : ''}">
  <Editor editorName="Written" />
  <Editor editorName="Unwritten" />
</div>

<!-- Progress  -->
{#if showProgress}
  <div
    style="font-family: {$siteFont}"
    class="progress {$dark ? 'dark-mode' : ''}"
    on:click={() => (showProgress = !showProgress)}
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
      class="{$dark ? 'dark-mode' : ''}"
      on:click={() => (showProgress = !showProgress)}
      in:fade={{ delay: 250, duration: 250 }} out:fade={{ duration: 50 }}
    >🫥</button>
  </div>
{/if}

<style>
  /* Global & Editors */

  :global(body) {
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
