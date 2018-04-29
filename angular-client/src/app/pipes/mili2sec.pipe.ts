import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mili2sec'
})
export class Mili2secPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Math.round(value/1000) +'s';
  }

}
