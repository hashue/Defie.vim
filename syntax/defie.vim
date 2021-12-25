if exists('b:current_syntax')
  finish
endif

syn match defieDirectory '^.\+/$'

hi! def link defieDirectory Directory

let b:current_syntax = 'defie'
