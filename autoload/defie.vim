function! defie#call_action(action,...) abort
  if &l:filetype !=# 'defie'
    return ''
  endif

  call denops#plugin#wait_async('Defie',{->denops#notify('Defie', 'call_Defie', [a:action])})
endfunction
