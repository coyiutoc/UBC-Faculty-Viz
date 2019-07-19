module.exports = function (df, gender) {
    
    const groupedDF = df.groupBy('gender');

    let collection = groupedDF.toCollection();
    let target_df;

    // Extract only the data w/ specified gender
    for (let row of collection) {
        if (row.groupKey.gender === gender) {
            target_df = row.group;
            break;
        }
    }

    // Group by dept
    const groupedDF_dept = target_df.groupBy('department');
    const counts = target_df.groupBy('department').aggregate((group) => group.count()).toDict();
    let dept_dict = counts["department"];
    let counts_dict = counts["aggregation"];

    // Summate across dept
    let res = groupedDF_dept.aggregate(group => group.stat.sum('renumeration')).rename('aggregation', 'sum_renumeration');

    // Getting top 10 by sum_renumeration
    res = res.sortBy('sum_renumeration', true);
    res = res.toCollection();

    // for (let row of res) {
    //     let department = row.department;
    //     let idx = dept_dict.indexOf(department);
    //     let count_val = counts_dict[idx];

    //     row.avg = row.sum_renumeration/count_val;
    // }

    // res = res.sort( function(a, b) {
    //     if (a.avg < b.avg){
    //         return 1;
    //     }
    //     if (a.avg > b.avg){
    //         return -1;
    //     }
    //     return 0;
    // });

    // console.log(res);

    return res.slice(1, 11);
}
