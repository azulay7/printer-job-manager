import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'mili2sec'
})
export class Mili2secPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      // return Math.round(value/1000) +'s'
      return moment.utc(moment.duration(value,"ms").asMilliseconds()).format("HH:mm:ss")

    }
    return null;
  }

}
