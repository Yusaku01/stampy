# @stampy/kit

All-in-one Stampy package for projects that want both the runtime API and the
local Studio launcher from one install.

## Usage

```sh
npm install @stampy/kit
```

Use the runtime API:

```ts
import {
  createStampyProject,
  registerStampyElements,
  renderStampSvg,
} from "@stampy/kit";

import "@stampy/kit/styles.css";
```

Start the local Studio:

```sh
npx stampy
```

Or:

```sh
npx stampy studio --port 4321
```

For smaller installs, use `@stampy/core` for runtime-only apps or
`@stampy/studio` for the Studio launcher only.
