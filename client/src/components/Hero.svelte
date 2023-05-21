<script lang="ts">
	type Comment = {
		id: number;
		author: string;
		body: string;
		postSlug: string;
	};

	async function getComments(): Promise<Comment[]> {
		const response = await fetch(
			`https://shiny-frost-d9d4.thomashutchinsondev-51c.workers.dev/comments`
		);
		return await response.json();
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class=" flex flex-col">
		<div class="max-w-md">
			{#await getComments() then comment}
				<pre>
          {JSON.stringify(comment, null, 2)}
        </pre>
			{/await}
		</div>

		<div class="hero-content">
			<div class="max-w-md">
				<h1 class="text-5xl font-bold">Hello there</h1>
				<p class="py-6">
					Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
					exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
				</p>
				<button class="btn btn-primary">Get Started</button>
			</div>
		</div>
	</div>
</div>
