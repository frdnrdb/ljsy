const since = (() => {
    const _ = {
      epochs: [60, 60, 24, 7, 4.35, 12, 10000],
      full: ['sekund', 'minutt', 'time', 'dag', 'uke', 'måned', 'år'],
      plural: ['er', 'er', 'r', 'er', 'r', 'er', ''],
      min: ['sek', 'min', 'time', 'dag', 'uke', 'mnd', 'år'],
      now: 'Akkurat nå',
      ago: ' siden',
      ahead: 'Om ',
    };

    const abs = x => (x ^ (x >> 31)) - (x >> 31); // perf: binary alternative to Math.abs(Integer)

    return (date, short, res) => {
      date = (new Date() - (date instanceof Date ? date : new Date(date))) / 1000;
        for (let i in _.epochs) {
          res = date % _.epochs[i];
          if (!(date = 0 | (date / _.epochs[i])))
            return i < 1
              ? _.now // instead of < 60 seconds
              : `${res < 0 ? _.ahead : ''}${abs(res)} ${short ? _.min[i] : _.full[i]}${res - 1 ? _.plural[i] : ''}${!res >= 0 ? _.ago : ''}`;
        }
      };
})();

export default since;