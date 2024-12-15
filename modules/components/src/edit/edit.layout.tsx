export type EditLayoutProps = {
    children: React.ReactNode[]
    onSubmit?: () => void
}
export type EditLayoutComponent = (props: EditLayoutProps) => React.ReactElement

export const EditLayout: EditLayoutComponent =
    ({children, onSubmit}: EditLayoutProps) => <div>
        {children}
        {onSubmit && <button onClick={onSubmit}>Submit</button>}
    </div>;