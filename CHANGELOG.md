### 0.2.0 (November 16, 2019)
* **Added** support for next.js server-side rendering integration using custom withStora HOC.
* **Changed** re-write README to include next.js setup, added API sections and fix typos.

### 0.1.1 (November 14, 2019)
* **Added** tightly integrated with [RoutRa](https://github.com/rawewhat/routra), a very simple router for React following StoRa footprint.
* **Added** with integration with [RoutRa](https://github.com/rawewhat/routra), you can use actions.quera.visit to change route right inside StoRa
* **Added** include a demo project to better understand how to use StoRa. just clone > yarn install > yarn dev
* **Fixed** in mutation config, it will detect whether to add state or action properly now

### 0.1.0 (November 12, 2019)
* **Removed**: error log when cannot find stora.config.js
* **Fixed**: in mutate config, you can mix up function and object inside it. useStora will check its type and add it to either states or actions accordingly.

## 0.0.1 (November 11, 2019)
### useStora hook
* can add more states using config mutate object
* can add more actions using config mutate object
* can filter screen states using config query object
### React component
* can get one or multiple states using destructuring syntax
* can get one or multiple actions using destructuring syntax
### Action function
* can get one screen states using key string
* can get multiple screen states using array of key string
* can set one screen states using key value pair
* can set multiple screen states using object
* can set multiple screen states using arrays of object