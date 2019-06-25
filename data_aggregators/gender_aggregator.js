module.exports = function (df) {
    
    const groupedDF = df.groupBy('gender');

    let res = groupedDF.aggregate(group => group.stat.sum('renumeration')).rename('aggregation', 'sum_renumeration');
    res.sortBy('sum_renumeration', false);
    res.show()

    let collection = res.toCollection();
    let total = 0;

    for (let row of collection) {
    	total += row.sum_renumeration;
    }

    collection.push({"total": total})

    return collection;
}
