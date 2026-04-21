<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import {
		Bold,
		Italic,
		Strikethrough,
		List,
		ListOrdered,
		Heading2,
		Heading3,
		Quote,
		Link as LinkIcon,
		Undo2,
		Redo2,
		Minus
	} from 'lucide-svelte';

	type Props = {
		value: string;
		onChange: (_html: string) => void;
		placeholder?: string;
	};

	let { value, onChange, placeholder = 'Écrivez ici…' }: Props = $props();

	let element: HTMLDivElement | undefined = $state();
	let editor: Editor | null = $state(null);

	onMount(() => {
		if (!element) return;
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({ heading: { levels: [2, 3] } }),
				Link.configure({ openOnClick: false, autolink: true }),
				Placeholder.configure({ placeholder })
			],
			content: value || '',
			editorProps: {
				attributes: {
					class:
						'prose prose-sm max-w-none focus:outline-none min-h-[160px] px-4 py-3 text-neutral-obsidian'
				}
			},
			onUpdate: ({ editor }) => {
				onChange(editor.getHTML());
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	// Keep the editor in sync when value changes externally (e.g. switching fields).
	$effect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value || '', { emitUpdate: false });
		}
	});

	function setLink() {
		const previous = editor?.getAttributes('link').href ?? '';
		const url = window.prompt('URL du lien', previous);
		if (url === null) return;
		if (url === '') {
			editor?.chain().focus().unsetLink().run();
			return;
		}
		editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}
</script>

<div class="rounded-xl border border-neutral-light bg-white overflow-hidden">
	<div class="flex flex-wrap gap-1 border-b border-neutral-light bg-neutral-sand px-2 py-2">
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('bold')}
			onclick={() => editor?.chain().focus().toggleBold().run()}
			aria-label="Gras"><Bold class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('italic')}
			onclick={() => editor?.chain().focus().toggleItalic().run()}
			aria-label="Italique"><Italic class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('strike')}
			onclick={() => editor?.chain().focus().toggleStrike().run()}
			aria-label="Barré"><Strikethrough class="w-4 h-4" /></button>

		<span class="w-px bg-neutral-light mx-1"></span>

		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('heading', { level: 2 })}
			onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
			aria-label="Titre"><Heading2 class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('heading', { level: 3 })}
			onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
			aria-label="Sous-titre"><Heading3 class="w-4 h-4" /></button>

		<span class="w-px bg-neutral-light mx-1"></span>

		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('bulletList')}
			onclick={() => editor?.chain().focus().toggleBulletList().run()}
			aria-label="Liste"><List class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('orderedList')}
			onclick={() => editor?.chain().focus().toggleOrderedList().run()}
			aria-label="Liste numérotée"><ListOrdered class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('blockquote')}
			onclick={() => editor?.chain().focus().toggleBlockquote().run()}
			aria-label="Citation"><Quote class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			onclick={() => editor?.chain().focus().setHorizontalRule().run()}
			aria-label="Séparateur"><Minus class="w-4 h-4" /></button>

		<span class="w-px bg-neutral-light mx-1"></span>

		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition"
			class:bg-white={isActive('link')}
			onclick={setLink}
			aria-label="Lien"><LinkIcon class="w-4 h-4" /></button>

		<span class="flex-1"></span>

		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition disabled:opacity-40"
			onclick={() => editor?.chain().focus().undo().run()}
			aria-label="Annuler"><Undo2 class="w-4 h-4" /></button>
		<button
			type="button"
			class="p-1.5 rounded hover:bg-white transition disabled:opacity-40"
			onclick={() => editor?.chain().focus().redo().run()}
			aria-label="Refaire"><Redo2 class="w-4 h-4" /></button>
	</div>

	<div bind:this={element}></div>
</div>
