const epochs = { 
    sekund: 60, 
    minutt: 60, 
    time: 24,
    dag: 7,
    uke: 4.35,
    måned: 12,
    år: 10000 
};
const minimal = {
    sekund: 'sek', 
    minutt: 'min', 
    time: 'time',
    dag: 'dag',
    uke: 'uke',
    måned: 'mnd',
    år: 'år'     
}
  const plural = {
    sekund: 'er', 
    minutt: 'er', 
    time: 'r',
    dag: 'er',
    uke: 'r',
    måned: 'er',
    år: ''   
};
export default (date, short) => {
    date = (new Date().getTime() - (date instanceof Date ? date : new Date(date)).getTime()) / 1000;
    let result;
    for (let epoch in epochs) {
        result = date % epochs[epoch];
        if (!(date = 0 | date / epochs[epoch]))
            return epoch === 'sekund'
            ? 'Akkurat nå'
            : (result < 0 ? 'Om ' : '') + Math.abs(result) + ' ' + (short ? minimal[epoch] : epoch + (result-1 ? plural[epoch] : ''));
    }
}