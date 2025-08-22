<script>
	import Heading from './Heading.svelte';
	import Paragraph from './Paragraph.svelte';
	import List from './List.svelte';
	import Image from './Image.svelte';
	import Table from './Table.svelte';
	import TableCell from './TableCell.svelte';
	import Link from './Link.svelte';
	import { toString } from 'mdast-util-to-string';
	import NodeComponent from './Node.svelte';

	export let child; // mdast node

	const isNode = (n) => n && typeof n === 'object' && 'type' in n;
</script>

{#if isNode(child)}
	{#if child.type === 'heading'}
		<Heading depth={child.depth} text={toString(child)} />
	{:else if child.type === 'paragraph'}
		<Paragraph>
			{#each child.children as inline}
				{#if inline.type === 'text'}
					{@html inline.value}
				{:else if inline.type === 'link'}
					<Link href={inline.url} title={inline.title}>
						{#each inline.children as sub}
							{#if sub.type === 'text'}{sub.value}{:else}<NodeComponent child={sub} />{/if}
						{/each}
					</Link>
				{:else if inline.type === 'emphasis'}
					<em>{toString(inline)}</em>
				{:else if inline.type === 'strong'}
					<strong>{toString(inline)}</strong>
				{:else if inline.type === 'inlineCode'}
					<code>{inline.value}</code>
				{:else}
					<NodeComponent child={inline} />
				{/if}
			{/each}
		</Paragraph>
	{:else if child.type === 'list'}
		<List ordered={!!child.ordered} start={child.start ?? 1} loose={!!child.spread}>
			{#each child.children as li}
				<li class="pl-4 list-outside">
					{#each li.children as inner}
						<NodeComponent child={inner} />
					{/each}
				</li>
			{/each}
		</List>
	{:else if child.type === 'image'}
		<Image href={child.url} title={child.title} text={child.alt || ''} />
	{:else if child.type === 'code'}
		<Paragraph pre={true}>{child.value}</Paragraph>
	{:else if child.type === 'table'}
		<Table>
			<thead>
				<tr>
					{#each child.children?.[0]?.children || [] as cell}
						<TableCell header={true} text={toString(cell)} />
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each child.children?.slice(1) || [] as row}
					<tr>
						{#each row.children || [] as cell}
							<TableCell text={toString(cell)} />
						{/each}
					</tr>
				{/each}
			</tbody>
		</Table>
	{:else if toString(child)}
		<Paragraph>{toString(child)}</Paragraph>
	{/if}
{/if}
