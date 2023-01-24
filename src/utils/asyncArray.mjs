export async function asyncMapMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const retArr = [];
  const promises = new Array(maxCount);
  let currentIndex = 0;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    if (rejected) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then((val) => {
        retArr[index] = val;
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
  return retArr;
}

export async function asyncForEachMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const promises = new Array(maxCount);
  let currentIndex = 0;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    if (rejected) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then(() => {
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
}

export async function asyncFilterMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const retArr = [];
  const promises = new Array(maxCount);
  let currentIndex = 0;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    if (rejected) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then((val) => {
        if (val) retArr[index] = arr[index];
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
  return retArr.filter((_, i, a) => i in a);
}

export async function asyncEveryMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const promises = new Array(maxCount);
  let currentIndex = 0;
  let isFalse = false;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    // or we found that every element is not true.
    if (rejected || isFalse) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then((val) => {
        if (!val) {
          isFalse = true;
          resolve();
        }
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
  return !isFalse;
}

export async function asyncSomeMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const promises = new Array(maxCount);
  let currentIndex = 0;
  let isTrue = false;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    // or we found that some element is true.
    if (rejected || isTrue) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then((val) => {
        if (val) {
          isTrue = true;
          resolve();
        }
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
  return isTrue;
}

export async function asyncFindIndexMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  let rejected = false;
  const promises = new Array(maxCount);
  let currentIndex = 0;
  let foundIndex = -1;
  function promiseExecutor(resolve, reject) {
    // If promise is rejected, we don't want to continue processing the next element.
    // or we found that some element is true.
    if (rejected || foundIndex !== -1) {
      resolve();
      return;
    }
    while (!(currentIndex in arr) && currentIndex < arr.length) {
      currentIndex += 1;
    }
    const index = currentIndex;
    currentIndex += 1;
    if (index >= arr.length) {
      resolve();
      return;
    }
    Promise.resolve(fn(arr[index], index, arr))
      .then((val) => {
        if (val) {
          foundIndex = index;
          resolve();
        }
        resolve(new Promise(promiseExecutor));
      })
      .catch((err) => {
        rejected = true;
        reject(err);
      });
  }
  for (let i = 0; i < maxCount; i += 1) {
    promises[i] = new Promise(promiseExecutor);
  }
  await Promise.all(promises);
  return foundIndex;
}

export async function asyncFindMaxConcurrent(maxCount, iterable, fn) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  const index = await asyncFindIndexMaxConcurrent(maxCount, arr, fn);
  return index === -1 ? undefined : arr[index];
}

export async function asyncReduce(iterable, fn, ...args) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  const startAt = args.length > 0 ? 0 : 1;
  let acc = startAt === 1 ? arr[0] : args[0];
  for (let i = startAt; i < arr.length; i += 1) {
    if (i in arr) {
      acc = await fn(acc, arr[i], i, arr);
    }
  }
  return acc;
}

export async function asyncReduceRight(iterable, fn, ...args) {
  const arr = Array.isArray(iterable) ? iterable : [...iterable];
  const startAt = args.length > 0 ? arr.length - 1 : arr.length - 2;
  let acc = startAt === arr.length - 1 ? arr[arr.length - 1] : args[0];
  for (let i = startAt; i >= 0; i -= 1) {
    if (i in arr) {
      acc = await fn(acc, arr[i], i, arr);
    }
  }
  return acc;
}
