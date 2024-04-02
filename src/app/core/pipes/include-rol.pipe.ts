import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includeRol',
  standalone: true,
})
export class IncludeRolPipe implements PipeTransform {
  transform(roles: string[], roles2: string[]): string[] {
    // return roles.includes(rol);

    return roles.sort((a, b) => {
      if (roles2.includes(a) && !roles2.includes(b)) {
        return -1; // a viene antes que b
      } else if (!roles2.includes(a) && roles2.includes(b)) {
        return 1; // b viene antes que a
      } else {
        return 0; // el orden no cambia
      }
    });
  }
}
