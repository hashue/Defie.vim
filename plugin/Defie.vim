command! -nargs=1 Defie call denops#plugin#wait_async('Defie', {->denops#notify('Defie', 'call_Defie', [<q-args>])})
