function! defie#call_defie(path,action) abort
  let s:args = {
        \ 'path':a:path,
        \ 'action': a:action
        \}
  call denops#plugin#wait_async('Defie',{
        \ ->denops#notify('Defie', 'call_Defie', [s:args])
        \})
endfunction

function! defie#call_action(action,...) abort
  if &l:filetype !=# 'defie'
    return ''
  endif

  let s:args = {
        \ 'action': a:action,
        \ 'direction':'',
        \}

  if a:0 >= 1
    let s:args['direction'] = a:1
  endif

  call denops#plugin#wait_async('Defie',{
        \->denops#notify('Defie', 'call_Defie', [s:args])
        \})
endfunction


let s:is_windows = has('win32') || has('win64')


" getcompletion
"
" ArgLead   the leading portion of the argument currently being completed on
" CmdLine   the entire command line
" CursorPos the cursor position in it (byte index)
"

function! defie#complete(arglead,cmdline,cursorpos) abort
  let _ = []
  let files = map(getcompletion(a:arglead,'dir'),
        \ { _, val -> s:substitute_path_separator(val) })
  return files
endfunction

function! s:substitute_path_separator(path) abort
  return s:is_windows ? substitute(a:path, '\\', '/', 'g') : a:path
endfunction

