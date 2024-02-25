# Framer Animations

> Simple, programmatic `framer-motion` animations

## Loader

> Fully controlled loader/spinner

![Loader in action](media/loader.gif)

```typescript
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