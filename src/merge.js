export const merge = (obj1, obj2) => {
    for (let key in obj2) {
        if (obj2[key].constructor === Object && obj1[key]) {
          obj1[key] = merge(obj1[key], obj2[key]);
        } 
        else {
          obj1[key] = obj2[key];
        }  
    }
    return obj1;
};