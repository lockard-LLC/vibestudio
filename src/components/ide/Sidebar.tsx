import { ExplorerView } from './sidebar/ExplorerView'
import { SearchView } from './sidebar/SearchView'
import { GitView } from './sidebar/GitView'
import { ExtensionsView } from './sidebar/ExtensionsView'

interface SidebarProps {
  activeView: 'explorer' | 'search' | 'git' | 'extensions'
  onTerminalToggle: () => void
}

export function Sidebar({ activeView, onTerminalToggle }: SidebarProps) {
  const renderView = () => {
    switch (activeView) {
      case 'explorer':
        return <ExplorerView onTerminalToggle={onTerminalToggle} />
      case 'search':
        return <SearchView />
      case 'git':
        return <GitView />
      case 'extensions':
        return <ExtensionsView />
      default:
        return <ExplorerView onTerminalToggle={onTerminalToggle} />
    }
  }

  return (
    <div className="w-full h-full bg-vscode-sidebar-background flex flex-col">
      {renderView()}
    </div>
  )
}