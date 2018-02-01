/**
 * 按照串关场数分组，3场串、4场串。。。8场串。
 * 每组串关场次包含多个串关方式，如3串3、3串4，多个串关方式对应不同的再分组区间。
 * [串N, Max, Min]表示比赛场次按N场分组后，每组再进行串Max分组，然后对每组进行组合；以上操作循环至Min
 */
const PASS_MODE_MAP = [
    [
        [3, 2, 2], //3x3
        [4, 3, 2] //3x4
    ],
    [
        [4, 3, 3], //4x4
        [5, 4, 3], //4x5
        [6, 2, 2], //4x6
        [11, 4, 2] //4x11
    ],
    [
        [5, 4, 4], //5x5
        [6, 5, 4], //5x6
        [10, 2, 2], //5x10
        [16, 5, 3], //5x16
        [20, 3, 2], //5x20
        [26, 5, 2] //5x26
    ],
    [
        [6, 5, 5], //6x6
        [7, 6, 5], //6x7
        [15, 2, 2], //6x15
        [20, 3, 3], //6x20
        [22, 6, 4], //6x22
        [35, 3, 2], //6x35
        [42, 6, 3], //6x42
        [50, 4, 2], //6x50
        [57, 6, 2] //6x57
    ],
    [
        [7, 6, 6], //7x7
        [8, 7, 6], //7x8
        [21, 5, 5], //7x21
        [35, 4, 4], //7x35
        [120, 7, 2] //7x120
    ],
    [
        [8, 7, 7], //8x8
        [9, 8, 7], //8x9
        [28, 6, 6], //8x28
        [56, 5, 5], //8x56
        [70, 4, 4], //8x70
        [247, 8, 2] //8x247
    ]
];

/**
 * 
 * @param {Array} matches 投注场次
 * @param {Number} cgCount 串关场数
 * @param {Number} cgMode 串关方式
 */
function createMode (matches, cgCount, cgMode){
// export default function createMode (matches, cgCount, cgMode){
    let cgroup = PASS_MODE_MAP[cgCount-3];
    let range = [];

    for(let i=0,len=cgroup.length; i<len; i++){
        if(cgroup[i][0] === cgMode){
            range = cgroup[i].slice(1);
            break;
        }
    }

    let ret = CS(matches, cgCount);//按照串关场数进行组合
    let total = [];//串关结果
    let [max, min] = range;
    
    //遍历组合，生成串关方式
    for(let j=0, jen=ret.length; j<jen; j++){
        //遍历串关方式对应的分组区间
        for(let k=min; k<=max; k++){
            let partial = CS(ret[j], k);

            //遍历最终的分组，进行每组元素中每场比赛选项的混合，如有三场比赛，则从每场比赛中选一个选项
            for(let p=0, pen=partial.length; p<pen; p++){
                let grp = mix(partial[p], partial[p].length);
                
                total = total.concat(grp);
            }
        }
    }

    return total;
}

//计算total场比赛的排列组合
function CS(total, num, i=0, concat) {
    let len = total.length,
        ret = [];

    for(let len=total.length; i<len; i++){
        let rest = concat ? [].concat(concat, [total[i]]) : [total[i]];

        if(num > 1){
            ret = ret.concat(CS(total, num-1, i+1, rest) );
        }else{
            ret.push(rest);
        }
    }

    return ret;
}

//遍历每组比赛，取每场比赛的一个选项进行组合
function mix(list, limit, idx=0, concat) {
    let ret=[];

    for(let i=0,len=list[idx].length; i<len; i++){
        let rest = concat ? concat.concat(list[idx][i]) : [list[idx][i]];
        if(limit>1){
            ret = ret.concat(mix(list, limit-1, idx+1, rest));
        }else{
            ret.push(rest);
        }
    }

    return ret;
}

/**
 * @usage
 */
let matches = [
    ['胜', '平'],
    ['让胜', '让平', '让负'],
    ['2:1', '1:1', '平其它'],
    [2, 3, 1],
    ['胜胜', '平胜']
];

createMode(matches, 4, 6); //上述比赛选项进行4x6串关后共201注
