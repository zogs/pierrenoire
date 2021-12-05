<script>
  import { onMount } from "svelte";

  let data;
  let table;

  onMount(async () => {

    try {
      const req = await fetch('/sync');
      const res = await req.json();
      data = res.data;

      table = data.html;
    }
    catch(error) {
      console.error(error);
    }
  });
</script>

<main>
  {#if table }
  <div class="table-container">
    {@html table}
  </div>
  {:else}
  Loading...
  {/if}
</main>

<style>
  :global(div.table-container table) { width:100%; border-collapse: collapse; }
  :global(div.table-container table tr.table-warning) { background-color:#ffeeba; }
  :global(div.table-container table th) { border: 1px solid #dee2e6; text-align:center; }
  :global(div.table-container table td) { border: 1px solid #dee2e6; text-align:center; }
</style>