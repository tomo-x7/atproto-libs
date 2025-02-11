## example
```TS
import { DidResolver, HandleResolver } from "@tomo-x/resolvers"

//resolve handle
const handleResolver = new HandleResolver("https://public.api.bsky.app");
const did = await handleResolver.resolve("yourhandle.bsky.social");
if (did == null) throw new Error("cannot resolve handle");
console.log(did);
//resolve DID
const didResolver = new DidResolver();
const didDoc = await didResolver.resolve(did);
console.log(didDoc)
```
## enviroment
Browser and edge (e.g. cloudflare workers)  
If you are using an environment with DNS resolution, such as node.js, I recommend using [@atproto/identity](https://www.npmjs.com/package/@atproto/identity) instead