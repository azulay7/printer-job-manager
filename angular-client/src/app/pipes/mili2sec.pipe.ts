import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mili2sec'
})
export class Mili2secPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      return Math.round(value/1000) +'s';
    }
    return null;
  }

}
