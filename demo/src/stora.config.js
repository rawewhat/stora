export default {
  states: {
    test: {
      testState: 'testState'
    },
    nested: {
      love: {
        me: 'me',
        us: 'us'
      }
    },
    obj: {
      test: 'no',
      test1: 'hi',
      test2: 'hello'
    },
    obj1: {
      test: 'no',
      test1: 'hi',
      test2: 'hello'
    },
    obj2: {
      test: 'no',
      test1: 'hi',
      test2: 'hello'
    },
    result: null
  },
  actions: {
    log: (store, ...msg) => {
      console.log(...msg)
    },
    set: ({ set }, key, value) => {
      set({ [key]: value })
    },
    get: ({ get }, key) => {
      return get(key)
    },
    setObj: ({ set }, obj) => {
      set(obj)
    }
  },
  init: store => {
    console.log('store', store)
  }
}

/*
export default {
  states: {
    test: {
      test1: "test1"
    },
    test2: {
      test3: "test3",
      test4: "test4"
    }
  },
  actions: {
    testing: ({ get, set }) => {
      console.log("test", get(["test", "test2"]));
      set([
        {
          test: {
            test1: "test2"
          }
        },
        {
          test2: {
            test3: null,
            test4: null
          }
        }
      ]);
    }
  },
  init: store => {
    console.log("store", store);
  }
};
*/
