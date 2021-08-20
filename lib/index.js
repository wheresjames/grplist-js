#!/usr/bin/env nodejs
'use strict';

const fs = require('fs');
const path = require('path');

function loadConfig(fname)
{   if (!fs.existsSync(fname))
        return {};
    let r = {};
    let data = fs.readFileSync(fname, 'utf8');
    let lines = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    lines.forEach(v =>
        {   v = v.trim();
            if ('#' != v[0])
            {   let parts = v.split(/\s+/);
                if (1 < parts.length)
                {   let k = parts.shift().trim().toLowerCase();
                    r[k] = parts.join(' ');
                }
            }
        });
    return r;
}

module.exports =
{
    __info__:       loadConfig(path.join(path.dirname(__dirname), 'PROJECT.txt')),
    groupList: groupList,
    groupList2: groupList2,
    groupArray: groupArray,
    groupArray2: groupArray2
};

/** Groups a list according to the specified function
    @param [in] arr       - Array to group
    @param [in] fnc       - Function that specifies grouping
                            The function should take two parameters
                            and return True if the items belong in
                            the same group.
    @param [in] vals      - Set to True if you want the function
                            to return a list of values.  If set
                            to False, the function will return a
                            list of keys.

    Example to group items less than three appart
    @begincode

        groups = groupList([1, 3, 6, 10, 12, 14, 21, 35], lambda a, b: 3 >= abs(a-b), True)

        > [[1, 3, 6], [10, 12, 14], [21], [35]]

    @endcode
*/
function groupList(arr, fnc, vals = false)
{
    let l = arr.length;
    if (1 > l)
        return [];
    else if (1 == l)
        return [vals ? arr : [0]];

    let g = 0;
    let m = Array(l).fill(-1);

    for (let k1 = 0; k1 < l; k1++)
    {
        for (let k2 = k1 + 1; k2 < l; k2++)
        {
            // Can they be grouped?
            if (fnc(arr[k1], arr[k2]))
            {
                // a nor b in group, a and b join new group
                if (-1 == m[k1] && -1 == m[k2])
                {
                    m[k1] = g;
                    m[k2] = g;
                    g += 1;
                }

                // a not in group, b in group, a joins b
                else if ( -1 == m[k1] && -1 != m[k2])
                    m[k1] = m[k2];

                // a in group, b not in group, b joins a
                else if ( -1 != m[k1] && -1 == m[k2])
                    m[k2] = m[k1];

                // Both in groups, merge groups if not already in the same group
                else if ( m[k1] != m[k2])
                {
                    g = g - 1;
                    let fr = m[k1];
                    let to = m[k2];
                    if (g == to)
                        [to, fr] = [fr, to];

                    for (let k3 = 0; k3 < l; k3++)
                        if (m[k3] == fr)
                            m[k3] = to;
                        else if (m[k3] == g)
                            m[k3] = fr;
                }
            }
        }

        // Create new group
        if (-1 == m[k1])
        {
            m[k1] = g;
            g += 1;
        }
    }

    let ret = [];
    while (g--)
        ret.push([]);

    for (let k = 0; k < l; k++)
        ret[m[k]].push(vals ? arr[k] : k);

    return ret

}


/** Groups a list according to the specified function

    This function is the same as groupList() but it minimizes the number
    of calls to the given compare function.

    @param [in] arr       - Array to group
    @param [in] fnc       - Function that specifies grouping
                            The function should take two parameters
                            and return True if the items belong in
                            the same group.
    @param [in] vals      - Set to True if you want the function
                            to return a list of values.  If set
                            to False, the function will return a
                            list of keys.

    Example to group items less than three appart
    @begincode

        groups = groupList2([1, 3, 6, 10, 12, 14, 21, 35], lambda a, b: 3 >= abs(a-b), True)

        > [[1, 3, 6], [10, 12, 14], [21], [35]]

    @endcode
*/
function groupList2(arr, fnc, vals = False)
{
    let l = arr.length;
    if (1 > l)
        return [];
    else if (1 == l)
        return [vals ? arr : [0]];

    let lg = -1;
    let m = Array(l).fill(-1);
    let g = Array(l).fill(-1);

    // Create a group map
    for (let k1 = 0; k1 < l; k1++)
    {
        let ingroup = -1;
        let gi = 0;
        while (-1 != g[gi])
        {
            // First group item
            let k2 = g[gi];

            while (true)
            {
                // Does it group with this item
                if (fnc(arr[k1], arr[k2]))
                {
                    // If we're already in a group, merge that group
                    if (-1 != ingroup)
                    {
                        // Find the end of the group we're in
                        let eg = k1;
                        while (m[eg] != -1)
                            eg = m[eg];

                        // Append current group
                        m[eg] = g[gi];

                        // Move last group to current slot
                        g[gi] = g[lg];
                        g[lg] = -1;
                        lg -= 1;
                        gi -= 1;
                    }

                    // Add us to this group
                    else
                    {
                        // Insert ourselves here
                        m[k1] = m[k2];
                        m[k2] = k1;

                        // Item has been grouped
                        ingroup = gi;
                    }
                    break
                }

                // Last item?
                if (-1 == m[k2])
                    break

                // Next item
                k2 = m[k2];
            }

            gi += 1
        }

        // Create a new group if it didn't fit anywhere
        if (-1 == ingroup)
        {
            g[gi] = k1
            lg = gi
        }
    }

    // Create groups by crawling the map
    let gi = 0;
    let ret = [];
    while (gi < l && -1 != g[gi])
    {
        // Where to start in the map
        let mi = g[gi];

        ret.push([]);
        let ri = ret.length-1;
        while (true)
        {
            ret[ri].push(vals ? arr[mi] : mi);

            // Last item?
            if (-1 == m[mi])
                break;

            // Next item
            mi = m[mi];
        }

        // Next group
        gi += 1;
    }

    return ret
}


/** Groups an array according to the specified function
    @param [in] arr       - Array to group
    @param [in] fnc       - Function that specifies grouping
                            The function should take two parameters
                            and return True if the items belong in
                            the same group.
    @param [in] vals      - Set to True if you want the function
                            to return a list of values.  If set
                            to False, the function will return a
                            list of keys.

    Example to group items less than three appart
    @begincode

        d = {'k0': 1, 'k1': 3, 'k2': 6, 'k3': 10, 'k4': 12, 'k5': 14, 'k6': 21, 'k7': 35, 'k8': 7, 'k9': 23}
        groups = groupArray(d, lambda a, b: 3 >= abs(a-b), True)

    @endcode
*/
function groupArray(obj, fnc, vals = False)
{
    let m = groupList(Object.values(obj), fnc, vals)

    // Map keys
    if (!vals)
    {   let keys = Object.keys(obj);
        for (let g of m)
            for (let i = 0; i < g.length; i++)
                g[i] = keys[g[i]];
    }

    return m;
}

/** Groups a dict according to the specified function

    This function is the same as groupDict() but it minimizes the number
    of calls to the given compare function.

    @param [in] arr       - Array to group
    @param [in] fnc       - Function that specifies grouping
                            The function should take two parameters
                            and return True if the items belong in
                            the same group.
    @param [in] vals      - Set to True if you want the function
                            to return a list of values.  If set
                            to False, the function will return a
                            list of keys.

    Example to group items less than three appart
    @begincode

        d = {'k0': 1, 'k1': 3, 'k2': 6, 'k3': 10, 'k4': 12, 'k5': 14, 'k6': 21, 'k7': 35, 'k8': 7, 'k9': 23}
        groups = groupDict2(d, lambda a, b: 3 >= abs(a-b), True)

    @endcode
*/
function groupArray2(obj, fnc, vals = False)
{
    let m = groupList2(Object.values(obj), fnc, vals)

    // Map keys
    if (!vals)
    {   let keys = Object.keys(obj);
        for (let g of m)
            for (let i = 0; i < g.length; i++)
                g[i] = keys[g[i]];
    }

    return m;
}
