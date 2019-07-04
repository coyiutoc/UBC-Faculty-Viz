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

    // Summate across dept
    let res = groupedDF_dept.aggregate(group => group.stat.sum('renumeration')).rename('aggregation', 'sum_renumeration');
    res.sortBy('sum_renumeration', false);

    res = res.sortBy('sum_renumeration', true);
    
    return res.toCollection();
}
