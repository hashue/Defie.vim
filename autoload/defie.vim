function! defie#call_defie(path,action) abort

  let s:args = {
        \ 'path':a:path,
        \ 'action': a:action
        \}

  call denops#plugin#wait_async('Defie',{->denops#notify('Defie', 'call_Defie', [s:args])})
endfunction

function! defie#call_action(action,direction) abort
  if &l:filetype !=# 'defie'
    return ''
  endif

  let s:args = {
        \ 'action': a:action,
        \ 'direction':a:direction,
        \}

  call denops#plugin#wait_async('Defie',{->denops#notify('Defie', 'call_Defie', [s:args])})
endfunction
