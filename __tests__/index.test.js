// In this file we will be writing all the code tests we would love to have

const { add } = require(`../client/index`)

test(`adds 1 + 2 to equal 3`, () => {
    expect(add(1, 2)).toBe(3);
});
