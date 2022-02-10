command! -nargs=1
      \ -complete=customlist,defie#complete
      \ Defie
      \ call defie#call_defie(<q-args>,'init')
