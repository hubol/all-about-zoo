import {ElementType} from "./utils/types/elementType";

const sectionIds = ['loading', 'fatal_error', 'game', 'start'] as const;

export function showSection(sectionId: ElementType<typeof sectionIds>) {
    sectionIds.forEach(x => document.getElementById(x)!.className = sectionId === x ? '' : 'invisible');
}
