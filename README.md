# Framer Animations

> Simple, programmatic `framer-motion` animations

## Loader/spinner

> Fully controlled loader/spinner

![Loader in action](media/loader.gif)

```jsx
import { useLoader } from 'framer-animations'

const { loader, animate } = useLoader()

async function request() {
  animate('load')
  try {
    const r = await fetch()
    // ...
    animate('succeed')
  }
  catch {
    // ...
    animate('fail')
  }
}

return (
  <div>
    // ...
    {loader}
  </div>
)
```

## Slideshow/full-page carousel

> Presence-based slideshow

![Slideshow in action](media/slideshow.gif)

```jsx
import { Slideshow } from 'framer-animations'

const [page, setPage] = useState('home')
const [dir, setDir] = useState('right')

const elem = (() => {
  switch (page) {
    case 'home':
      return (
        <div>
          // ...
          <button onClick={() => { setPage('about'); setDir('right') }}>About</button>
        </div>
      )
    case 'about':
      return (
        <div>
          // ...
          <button onClick={() => { setPage('home'); setDir('left') }}>Back</button>
        </div>
      )
    case '...':
      ...
  }
})()

return (
  <Slideshow pageKey={page} direction={dir}>
    {elem}
  </Slideshow>
)
```

## Carousel

> Fully controlled, swipable carousel

![Carousel in action](media/carousel.gif)

```jsx
import { useCarousel } from 'framer-animations'

const { carousel, goto, selected } = useCarousel({
  numItems: 10, item: idx => <p>Item {idx}</p>
})
// or
const { carousel, goto, selected } = useCarousel({
  mode: 'eager': items: [
    <p>Item 1</p>,
    // ...
    <p>Item N</p>
  ]
})

return (
  <div>
    {carousel}
    <button onClick={() => goto(0)}>Start</button>
    <p>Page: {selected}</p>
    <button onClick={() => goto(9)}>End</button>
  </div>
)
```