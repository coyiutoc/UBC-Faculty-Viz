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
    const groupedDF_dept = target_df.groupBy('position');
    const counts = target_df.groupBy('position').aggregate((group) => group.count()).toDict();
    let pos_dict = counts["position"];
    let counts_dict = counts["aggregation"];

    // Summate across dept
    let res = groupedDF_dept.aggregate(group => group.stat.sum('renumeration')).rename('aggregation', 'sum_renumeration');

    // Getting top 10 by sum_renumeration
    //res = res.sortBy('sum_renumeration', true);
    res = res.toCollection();

    let final_res = [];

    for (let row of res) {
        if (row.position !== ""){
            final_res.push(row);
        }
    }

    for (let row of final_res) {
        let position = row.position;
        let idx = pos_dict.indexOf(position);
        let count_val = counts_dict[idx];

        row.value = row.sum_renumeration/count_val;
    }

    final_res = final_res.sort( function(a, b) {
        if (a.value < b.value){
            return 1;
        }
        if (a.value > b.value){
            return -1;
        }
        return 0;
    });

    return final_res.slice(0,10);
}
