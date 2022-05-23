let s:args = {
      \ 'path'     : '',
      \ 'action'   : '',
      \ 'direction': '',
      \ }

function! s:exec() abort
  let l:CallBack = function('denops#notify',[
        \ 'Defie',
        \ 'call_Defie',
        \ [s:args],
        \ ])

  call denops#plugin#wait_async('Defie',l:CallBack)
endfunction

function! defie#call_defie(path,action) abort
  let s:args.path   = a:path
  let s:args.action = a:action
  call s:exec()
endfunction

function! defie#call_action(action,...) abort
  if &l:filetype !=# 'defie'
    return ''
  endif

  let s:args.action    = a:action

  if a:0 >= 1
    let s:args.direction = a:1
  else
    let s:args.direction = ''
  endif

  call s:exec()
endfunction




" getcompletion
"
" ArgLead   the leading portion of the argument currently being completed on
" CmdLine   the entire command line
" CursorPos the cursor position in it (byte index)
"

let s:is_windows = has('win32') || has('win64')

function! defie#complete(arglead,cmdline,cursorpos) abort
  let _ = []
  let files = map(getcompletion(a:arglead,'dir'),
        \ { _, val -> s:substitute_path_separator(val) })
  return files
endfunction

function! s:substitute_path_separator(path) abort
  return s:is_windows ? substitute(a:path, '\\', '/', 'g') : a:path
endfunction

