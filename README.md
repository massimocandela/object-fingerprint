## object-fingerprint

Just see example:

```js
import fingerprint from "object-fingerprint";

const myObject1 = {
  key1: "pizza",
  key2: ["an", "array"]
};

const myObject1 = {
  key2: ["an", "array"],
  key1: "pizza"
};

const myObject3 = {
    key2: ["array", "an"],
    key1: "pizza"
};

fingerprint(myObject1); // 6afe6f0e
fingerprint(myObject2); // 6afe6f0e
fingerprint(myObject3); // -409427c2
```