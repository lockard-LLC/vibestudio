# Vendor Dependencies

This directory contains third-party source code integrated as git subtrees for better control and customization.

## Monaco Editor

**Location**: `vendor/monaco-editor/`  
**Source**: https://github.com/microsoft/monaco-editor.git  
**Integration**: Git subtree  
**Purpose**: Core editor functionality for VibeStudio IDE  

### Why Git Subtree?

1. **Source Control**: Direct access to Monaco Editor source code for customization
2. **Stability**: Pin to specific versions and control updates
3. **Customization**: Ability to modify editor behavior and theming
4. **Organization**: Keep third-party code separate but accessible

### Usage

The Monaco Editor is primarily used through the npm package `@monaco-editor/react`, but having the source available allows for:

- **Custom themes** and syntax highlighting
- **Advanced editor configurations**
- **Extension development**
- **Performance optimizations**
- **Security auditing**

### Path Aliases

The vendor directory is accessible via TypeScript/Vite path alias:
```typescript
import { something } from '@/vendor/monaco-editor/...'
```

### Updating Monaco Editor

To update the Monaco Editor subtree:

```bash
# Fetch latest changes
git subtree pull --prefix=vendor/monaco-editor https://github.com/microsoft/monaco-editor.git main --squash

# Or update to specific version
git subtree pull --prefix=vendor/monaco-editor https://github.com/microsoft/monaco-editor.git v0.52.2 --squash
```

### Integration with VibeStudio

The Monaco Editor is integrated through:
- `src/components/editor/MonacoEditor.tsx` - React wrapper component
- Custom themes in the component for VibeStudio branding
- TypeScript configuration for IntelliSense
- Vite build configuration for optimal bundling

For more details, see the [editor documentation](../src/components/editor/README.md).