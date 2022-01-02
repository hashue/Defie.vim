function! defie#call_defie(path,action) abort

  let s:args = {
        \ 'path':a:path,
        \ 'action': a:action
        \}

  call denops#plugin#wait_async('Defie',{->denops#notify('Defie', 'call_Defie', [s:args])})
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

  call denops#plugin#wait_async('Defie',{->denops#notify('Defie', 'call_Defie', [s:args])})
endfunction
