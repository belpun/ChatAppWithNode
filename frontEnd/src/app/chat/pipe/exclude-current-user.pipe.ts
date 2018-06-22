import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeCurrentUser',
  pure: false
})
export class ExcludeCurrentUserPipe implements PipeTransform {

  transform(value: any[], args?: any): any {
    return value.filter(item => item.firstName !== localStorage.getItem('name') );
  }

}
