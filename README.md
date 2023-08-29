# ddu-source-output

Command output source for ddu.vim

This source collects Vim Ex-command output.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddu.vim

https://github.com/Shougo/ddu.vim

### ddu-kind-word

https://github.com/Shougo/ddu-kind-word

## Configuration

```vim
call ddu#start(#{ 'sources': [#{ name: 'output' }] })
```
