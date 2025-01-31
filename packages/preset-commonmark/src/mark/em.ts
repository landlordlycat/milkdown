import { createMark, markRule } from '@milkdown/utils';
import { toggleMark } from 'prosemirror-commands';
import { SupportedKeys } from '../supported-keys';

type Keys = SupportedKeys['Em'];
const id = 'em';
export const em = createMark<Keys>((_, utils) => ({
    id,
    schema: {
        parseDOM: [
            { tag: 'i' },
            { tag: 'em' },
            { style: 'font-style', getAttrs: (value) => (value === 'italic') as false },
        ],
        toDOM: (mark) => ['em', { class: utils.getClassName(mark.attrs, id) }],
    },
    parser: {
        match: (node) => node.type === 'emphasis',
        runner: (state, node, markType) => {
            state.openMark(markType);
            state.next(node.children);
            state.closeMark(markType);
        },
    },
    serializer: {
        match: (mark) => mark.type.name === id,
        runner: (state, mark) => {
            state.withMark(mark, 'emphasis');
        },
    },
    inputRules: (markType) => [
        markRule(/(?:^|[^_])(_([^_]+)_)$/, markType),
        markRule(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
    ],
    commands: (markType) => ({
        [SupportedKeys.Em]: {
            defaultKey: 'Mod-i',
            command: toggleMark(markType),
        },
    }),
}));
