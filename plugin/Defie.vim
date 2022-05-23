if exists('g:loaded_defie')
  finish
endif
let g:loaded_defie = 1

command! -nargs=1
      \ -complete=customlist,defie#complete
      \ Defie
      \ call defie#call_defie(<q-args>,'init')
