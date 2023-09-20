export interface Viewer<T, V> {
    view(items: T): V
}

export type AsyncViewer<T, V> = Viewer<T[], Promise<V[]>>