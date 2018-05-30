// import * as moment from 'moment';
// export function ParseTime(zuluTime: string) {
//     let zuluMomentTime = moment(zuluTime);
//     if (!zuluTime.includes('GMT') && !zuluTime.includes('Z')) {
//         zuluMomentTime = moment(zuluTime + "Z");
//     }
//     let zuluDateTime = zuluMomentTime.toDate();

//     zuluDateTime.setMinutes(zuluDateTime.getMinutes() - zuluDateTime.getTimezoneOffset())
//     return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
// }

function MakeNumber(s: string[])
{
  let n: number[] = [];
  for(var x of s){
    n.push(Number(x));
  }
  return n;
}

function ParseTime(zuluTime: string){
  var time = zuluTime.split(' ');
  var dates = MakeNumber(time[0].split('-'));
  var times = MakeNumber(time[1].split(':'));
  return new Date(dates[0], dates[1]-1, dates[2], times[0], times[1], times[2] );
}
export function FormatTime(zuluDateTime: Date){
  return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
}

export function ParseAndFormatTime(zuluTime: string){
  return FormatTime(ParseTime(zuluTime));
}