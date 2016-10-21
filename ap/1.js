const Either = require('../either')

const $ = selector =>
  Either.of({selector, height: 10})

const getScreenSize = (screen, head, foot) =>
  screen - (head.height + foot.height)

Either
  .of(h => f => getScreenSize(1040, h, f))
  .ap($('header'))
  .ap($('footer'))

// Box(f).ap(Box(x)) ~= Box(x).map(x => f(x))

// $('header')
//   .chain(h =>
//     $('footer')
//       .map(f => getScreenSize(1040, h, f)))
