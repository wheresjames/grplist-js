#!/usr/bin/env nodejs
'use strict';

const gl = require('grplist');

const Log = console.log;

function showBreak()
{
    console.log('\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n');
}

function fmt(a)
{
    return JSON.stringify(a);
}

function test_1()
{
    showBreak();

    let tests = [
        [1, 6, 3],
        [10, 20, 30, 40, 50],
        [1, 3, 6, 10, 12, 14, 21, 35],
        [1, 3, 6, 10, 12, 14, 21, 35, 7, 23],
        [1, 10, 20, 5, 15, 3, 7],
        [1, 10, 20, 30, 40, 35, 32, 5, 11, 2, 3, 16, 17, 12, 33, 34, 35, 33, 3, 42],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    for (let t of tests)
    {
        function cmpVal(a, b)
        {
            test_1.c += 1;
            return 3 >= Math.abs(a-b);
        }

        test_1.c = 0;
        let m = gl.groupList(t, cmpVal, true);
        Log(test_1.c, " : ", fmt(t), " -> ", fmt(m));

        test_1.c = 0;
        m = gl.groupList2(t, cmpVal, true);
        Log(test_1.c, " : ", fmt(t), " -> ", fmt(m));
    }

}

function test_2()
{
    showBreak();

    let a = {'k0': 1, 'k1': 3, 'k2': 6, 'k3': 10, 'k4': 12, 'k5': 14, 'k6': 21, 'k7': 35, 'k8': 7, 'k9': 23};

    let m = gl.groupArray(a, (a, b) => 3 >= Math.abs(a-b), false);
    Log(fmt(a), " -> ", fmt(m)) // [['k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k8'], ['k6', 'k9'], ['k7']]

    m = gl.groupArray(a, (a, b) => 3 >= Math.abs(a-b), true);
    Log(fmt(a), " -> ", fmt(m)) // [['k0', 'k1', 'k2'], ['k3', 'k4', 'k5', 'k8'], ['k6', 'k9'], ['k7']]
}

// Group letters
function test_3()
{
    showBreak();

    function anyLetters(a, b)
    {
        for(let l of a)
            if (0 <= b.indexOf(l))
                return true;
        return false;
    }

    let t = ['on', 'tw', 'th', 'fo', 'fi', 'si', 'te', 'zk'];
    Log(fmt(t), " -> ", fmt(gl.groupList2(t, anyLetters, true)));
}

// Group factors
function test_4()
{
    showBreak();

    let t = [3, 4, 5, 6, 7, 8, 9, 10];
    Log(fmt(t), " -> ", fmt(gl.groupList2(t, (a, b) => !(a % b), true)));
}


// Group overlapping tracks
function test_5()
{
    showBreak();

    function showTracks(t, bs, es)
    {
        let n = 0;
        console.log(' : 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8 0 2 4 6 8');
        for(let i of t)
            if (i[es] > i[bs])
            {
                let s = ''.padStart(i[bs], ' ') + '|' + ''.padStart(i[es] - i[bs] - 1, '-') + '|';
                console.log(`${n}: ${s}`);
                n += 1;
            }
    }

    let t = [
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

    console.log("\n--- INPUT ---");
    showTracks(t, 'beg', 'end');

    let g = gl.groupList2(t, (a, b) => a['beg'] <= b['end'] && a['end'] >= b['beg'], true);

    let i = 0
    for (let t of g)
    {
        i += 1;
        console.log(`\n--- GROUP ${i} ---`);
        showTracks(t, 'beg', 'end');
    }
}


function main()
{
    Log("--- START TESTS ---\n");

    test_1();
    test_2();
    test_3();
    test_4();
    test_5();

    Log('--- Done ---\n');
}

// Exit handling
process.on('exit',function() { Log('~ exit ~');});
process.on('SIGINT',function() { Log('~ keyboard ~'); process.exit(-1); });
process.on('uncaughtException',function(e) { Log('~ uncaught ~', e); process.exit(-1); });

// Run the program
main();

