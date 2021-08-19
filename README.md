
# grplist

Groups list items using a compare function.

``` javascript

    const gl = require('grplist');

    let m = gl.groupList([1,3,6,10,12,14,21,35], (a, b) => 3 >= Math.abs(a-b), true);

    // m -> [[1,3,6],[10,12,14],[21],[35]]

```

---------------------------------------------------------------------
## Table of contents

* [Install](#install)
* [Examples](#examples)
* [References](#references)

&nbsp;

---------------------------------------------------------------------
## Install

    $ npm install grplist

&nbsp;


---------------------------------------------------------------------
## Examples

``` javascript

    const gl = require('grplist');

    const Log = console.log;
    const Fmt = JSON.stringify;
    function show(t, m) { Log(Fmt(t), " -> ", Fmt(m)); }

    let t, m;

    //--------------------------------------------------------------
    // Group integers <= 3 apart
    t = [1, 3, 6, 10, 12, 14, 21, 35];
    m = gl.groupList(t, (a, b) => 3 >= Math.abs(a-b), true);
    show(t, m); // > [1,3,6,10,12,14,21,35]  ->  [[1,3,6],[10,12,14],[21],[35]]


    //--------------------------------------------------------------
    // Group factors
    t = [3, 4, 5, 6, 7, 8, 9, 10];
    m = gl.groupList2(t, (a, b) => !(a % b), true);
    show(t, m); // > [3,4,5,6,7,8,9,10]  ->  [[3,9,6],[4,8],[5,10],[7]]


    //--------------------------------------------------------------
    // Group Letters
    function anyLetters(a, b)
    {
        for(let l of a)
            if (0 <= b.indexOf(l))
                return true;
        return false;
    }

    t = ['on', 'tw', 'th', 'fo', 'fi', 'si', 'te', 'zk'];
    m = gl.groupList(t, anyLetters, true);
    show(t, m); // > ["on","tw","th","fo","fi","si","te","zk"]  ->  [["on","fo","fi","si"],["tw","th","te"],["zk"]]

    //--------------------------------------------------------------
    // Group tracks

    function showTracks(t, bs, es)
    {
        let n = 0;
        Log(' : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8');
        for(let v of t)
            if (v[es] > v[bs])
            {   let s = ''.padStart(v[bs], ' ') + '|' + ''.padStart(v[es] - v[bs] - 1, '-') + '|';
                Log(`${n}: ${s}`);
                n += 1;
            }
    }

    t = [
        {'beg': 2,  'end': 10},
        {'beg': 20, 'end': 25},
        {'beg': 4,  'end': 7},
        {'beg': 30, 'end': 35},
        {'beg': 8,  'end': 17},
        {'beg': 22, 'end': 28},
        {'beg': 33, 'end': 45},
        {'beg': 1,  'end': 4},
        // {'beg': 0,  'end': 74},
    ]

    Log("\n--- INPUT ---");
    showTracks(t, 'beg', 'end');

    let g = gl.groupList2(t, (a, b) => a['beg'] <= b['end'] && a['end'] >= b['beg'], true);

    let i = 0
    for (let t of g)
    {
        i += 1;
        Log(`\n--- GROUP ${i} ---`);
        showTracks(t, 'beg', 'end');
    }

    /* >
        --- INPUT ---
         : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8
        0:   |-------|
        1:                     |----|
        2:     |--|
        3:                               |----|
        4:         |--------|
        5:                       |-----|
        6:                                  |-----------|
        7:  |--|

        --- GROUP 1 ---
         : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8
        0:   |-------|
        1:  |--|
        2:         |--------|
        3:     |--|

        --- GROUP 2 ---
         : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8
        0:                     |----|
        1:                       |-----|

        --- GROUP 3 ---
         : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8
        0:                               |----|
        1:                                  |-----------|
    */
```

&nbsp;


---------------------------------------------------------------------
## References

- Node.js
    - https://nodejs.org/

- npm
    - https://www.npmjs.com/

